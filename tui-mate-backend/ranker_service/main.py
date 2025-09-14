# ranker_service/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import numpy as np

app = FastAPI(title="Local Tutor Ranker")

# Small, fast, CPU-friendly model
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
model = SentenceTransformer(MODEL_NAME)

def safe_join(arr, sep=", "):
    return sep.join(arr) if isinstance(arr, list) and len(arr) > 0 else "N/A"

def make_student_text(prefs: Dict[str, Any]) -> str:
    return (
        f"Subjects: {safe_join(prefs.get('subjects', []))}; "
        f"StudyTime: {safe_join(prefs.get('studyTime', []))}; "
        f"ClassType: {prefs.get('classType', 'N/A')}; "
        f"GenderPref: {prefs.get('genderPreference', 'N/A')}"
    )

def make_tutor_text(t: Dict[str, Any]) -> str:
    subjects = safe_join(t.get("subjects", []))
    avail = safe_join(t.get("availability", []))
    rating = t.get("rating", {}).get("value", 0)
    loc = t.get("location", "N/A")
    bio = t.get("bio", "") or ""
    name = t.get("name", "Tutor")
    return f"{name}. Subjects: {subjects}. Availability: {avail}. Rating: {rating}. Location: {loc}. {bio}"

def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    a = a / (np.linalg.norm(a) + 1e-8)
    b = b / (np.linalg.norm(b) + 1e-8)
    return float(np.dot(a, b))

def rule_score(prefs: Dict[str, Any], t: Dict[str, Any]) -> float:
    s_subj = set(prefs.get("subjects", []) or [])
    s_time = set(prefs.get("studyTime", []) or [])
    s_gender = prefs.get("genderPreference", None)

    t_subj = t.get("subjects", []) or []
    t_avail = t.get("availability", []) or []
    t_gender = t.get("gender", None)
    rating = float((t.get("rating") or {}).get("value", 0))  # 0..5

    subject_match = 1.0 if any(x in s_subj for x in t_subj) else 0.0
    if len(t_avail) > 0 and len(s_time) > 0:
        time_overlap = 1.0 if any(x in s_time for x in t_avail) else 0.0
    else:
        time_overlap = 0.5  # neutral if unknown

    if s_gender:
        gender_match = 1.0 if t_gender == s_gender else 0.0
    else:
        gender_match = 0.5  # neutral if no preference

    rating_norm = max(0.0, min(1.0, rating / 5.0))

    # tweak weights if you like
    score = 1.0*subject_match + 0.8*time_overlap + 0.5*rating_norm + 0.3*gender_match
    # Normalize to ~[0, ~2.6] → squash to 0..1
    return min(1.0, score / 2.6)

class TutorIn(BaseModel):
    _id: str
    name: str = "Tutor"
    subjects: List[str] = []
    availability: List[str] = []
    rating: Dict[str, Any] = {}
    location: str = "N/A"
    gender: str | None = None
    bio: str | None = None

class RankRequest(BaseModel):
    studentPrefs: Dict[str, Any]
    tutors: List[TutorIn]
    topK: int = 3

@app.post("/rank")
def rank(req: RankRequest):
    # Build texts
    q_text = make_student_text(req.studentPrefs)
    t_texts = [make_tutor_text(t.dict()) for t in req.tutors]

    # Embeddings
    q_vec = model.encode(q_text)
    t_vecs = model.encode(t_texts)

    # Compute scores
    results = []
    for t, t_vec in zip(req.tutors, t_vecs):
        sim = cosine_sim(q_vec, t_vec)  # ~ -1..1 (usually 0..1 for this use)
        # normalize cosine to 0..1
        sim01 = (sim + 1.0) / 2.0
        rscore = rule_score(req.studentPrefs, t.dict())
        final = 0.7*sim01 + 0.3*rscore
        results.append({
            "_id": t._id,
            "name": t.name,
            "score": round(float(final), 4),
            "reason": f"subject/time match + similarity {round(sim01,3)} & rule {round(rscore,3)}"
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return {"results": results[:max(1, req.topK)]}
