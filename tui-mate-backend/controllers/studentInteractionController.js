const StudentInteraction = require('../models/StudentInteraction');

exports.logSearch = async (req, res) => {
  const studentId = req.params.id;
  const { query } = req.body;

  try {
    let interaction = await StudentInteraction.findOne({ studentId });
    if (!interaction) {
      interaction = new StudentInteraction({ studentId, searches: [], filterUsage: [] });
    }

    interaction.searches.push(query);
    await interaction.save();

    res.status(200).json({ message: 'Search logged' });
  } catch (err) {
    console.error('Log search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logFilterUsage = async (req, res) => {
  const studentId = req.params.id;
  const { location, classType } = req.body;

  try {
    let interaction = await StudentInteraction.findOne({ studentId });
    if (!interaction) {
      interaction = new StudentInteraction({ studentId, searches: [], filterUsage: [] });
    }

    interaction.filterUsage.push({ location, classType });
    await interaction.save();

    res.status(200).json({ message: 'Filter usage logged' });
  } catch (err) {
    console.error('Log filter usage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
