import React from 'react';

import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';

import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import GetStartedScreen from './screens/GetStartedScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import StudentSignupScreen from './screens/StudentSignupScreen';
import StudentLoginScreen from './screens/StudentLoginScreen';
import TutorSignupScreen from './screens/TutorSignupScreen';
import TutorLoginScreen from './screens/TutorLoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VerifyOTPScreen from './screens/VerifyOTPScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import NewPasswordScreen from './screens/NewPasswordScreen';
import TutorDashboardScreen from './screens/TutorDashboardScreen';
import TutorClassCreationScreen from './screens/TutorClassCreationScreen';
import StudentDashboardScreen from './screens/StudentDashboardScreen';
import SearchTutorsScreen from './screens/SearchTutorsScreen';
import StudentQuizScreen from './screens/StudentQuizScreen';
import TutorProfileScreen from './screens/TutorProfileScreen';
import TutorDetailsScreen from './screens/TutorDetailsScreen';
import ConfirmBookingScreen from './screens/ConfirmBookingScreen';
import BookingConfirmedScreen from './screens/BookingConfirmedScreen';
import StudentRequestScreen from './screens/StudentRequestScreen';
import BookingDetailsStudentScreen from './screens/BookingDetailsStudentScreen';
import BookingRequestsStudentScreen from './screens/BookingRequestsStudentScreen';
import SubmitReviewScreen from './screens/SubmitReviewScreen';
import TutorTimeTableScreen from './screens/TutorTimeTableScreen';
import ClassDetailsScreen from './screens/ClassDetailsScreen';
import TutorChatListScreen from './screens/TutorChatListScreen';
import StudentChatListScreen from './screens/StudentChatListScreen';
import ChatScreen from './screens/ChatScreen';
import NotificationScreen from './screens/NotificationScreen';
import StudentProfileScreen from './screens/StudentProfileScreen';
import TutorForgotPasswordScreen from './screens/TutorForgotPasswordScreen';
import TutorVerifyOTPScreen from './screens/TutorVerifyOTPScreen';
import TutorResetPasswordScreen from './screens/TutorResetPasswordScreen';
import StudentSettingsScreen from './screens/StudentSettingsScreen';
import StudentEditProfileScreen from './screens/StudentEditProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import StudentQuizPreferencesScreen from './screens/StudentQuizPreferencesScreen';
import TutorSettingsScreen from './screens/TutorSettingsScreen';
import TutorChangePasswordScreen from './screens/TutorChangePasswordScreen';
import TutorProgressScreen from './screens/TutorProgressScreen';
import StudentProgressScreen from './screens/StudentProgressScreen';
import TutorReviewsScreen from './screens/TutorReviewsScreen';
const Stack = createNativeStackNavigator();

import AppLoading from 'expo-app-loading';





export default function App() {
  const [fontsLoaded] = useFonts({
  Nunito_400Regular,
  Nunito_700Bold,
});


  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentSignup" component={StudentSignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TutorSignup" component={TutorSignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TutorLogin" component={TutorLoginScreen} options={{ headerShown: false }} />
       
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="TutorDashboard" component={TutorDashboardScreen} />
        <Stack.Screen name="TutorClassCreation" component={TutorClassCreationScreen} />
        <Stack.Screen name="SearchTutors" component={SearchTutorsScreen} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} />
        <Stack.Screen name="StudentQuiz" component={StudentQuizScreen} />
         <Stack.Screen name="TutorProfile" component={TutorProfileScreen} />
         <Stack.Screen name="TutorDetails" component={TutorDetailsScreen} />
         <Stack.Screen name="ConfirmBooking" component={ConfirmBookingScreen} />
         <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
          <Stack.Screen name="StudentRequest" component={StudentRequestScreen} />
          <Stack.Screen name="BookingDetailsStudent" component={BookingDetailsStudentScreen} />
       <Stack.Screen name="BookingRequestsStudent" component={BookingRequestsStudentScreen} />
       <Stack.Screen name="SubmitReview" component={SubmitReviewScreen} />
       <Stack.Screen name="TutorTimeTable" component={TutorTimeTableScreen} />
        <Stack.Screen name="ClassDetails" component={ClassDetailsScreen} />
        <Stack.Screen name="StudentChatList" component={StudentChatListScreen} />
        <Stack.Screen name="TutorForgotPassword" component={TutorForgotPasswordScreen} />
<Stack.Screen name="TutorVerifyOTP" component={TutorVerifyOTPScreen} />
<Stack.Screen name="TutorResetPassword" component={TutorResetPasswordScreen} />
<Stack.Screen name="StudentEditProfile" component={StudentEditProfileScreen} />
<Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
<Stack.Screen name="StudentQuizPreferences" component={StudentQuizPreferencesScreen} />
<Stack.Screen name="TutorSettings" component={TutorSettingsScreen} />
<Stack.Screen name="TutorChangePassword" component={TutorChangePasswordScreen} />
<Stack.Screen name="TutorProgress" component={TutorProgressScreen} />
<Stack.Screen name="StudentProgress" component={StudentProgressScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="TutorChatList" component={TutorChatListScreen} />
          <Stack.Screen name="TutorReviews" component={TutorReviewsScreen} />
        <Stack.Screen name="StudentSettings" component={StudentSettingsScreen} />
        <Stack.Screen
  name="NotificationScreen"
  component={NotificationScreen}
  options={{ title: 'Notifications' }}
/>





  


     

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
