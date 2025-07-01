// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeUserScreen from '../screens/HomeUserScreen';
import HomeTechnicianScreen from '../screens/HomeTechnicianScreen';
import BookingScreen from '../screens/BookingScreen';
import HomeTechnicianScreen from '../screens/HomeTechnicianScreen';
import ChatScreen from '../screens/ChatScreen';
import TrackTechnicianScreen from '../screens/TrackTechnicianScreen';
import PaymentScreen from '../screens/PaymentScreen';
import RatingScreen from '../screens/RatingScreen';
import HistoryUserScreen from '../screens/HistoryUserScreen';
import HistoryTechnicianScreen from '../screens/HistoryTechnicianScreen';
import ExportScreen from '../screens/ExportScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="HomeUser" component={HomeUserScreen} />
        <Stack.Screen name="HomeTechnician" component={HomeTechnicianScreen} />
        
<Stack.Screen name="Booking" component={BookingScreen} />
<Stack.Screen name="HomeTechnician" component={HomeTechnicianScreen} />
<Stack.Screen name="Chat" component={ChatScreen} />
<Stack.Screen name="TrackTechnician" component={TrackTechnicianScreen} />
<Stack.Screen name="Payment" component={PaymentScreen} />
<Stack.Screen name="Rating" component={RatingScreen} />
<Stack.Screen name="HistoryUser" component={HistoryUserScreen} />
<Stack.Screen name="HistoryTechnician" component={HistoryTechnicianScreen} />
<Stack.Screen name="Export" component={ExportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
