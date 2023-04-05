import React from 'react';
import {Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Service from '../screens/Service';
import Home from '../screens/Home';
import SavedAds from '../screens/SavedAds';
import ProfileScreen from '../screens/ProfileScreen';

const HomeStack = createNativeStackNavigator();
const SavedAdsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const CustomNavigation = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {backgroundColor: '#FA8C00'},
      tabBarActiveTintColor: '#FFF',
      tabBarInactiveTintColor: '#000',
    }}>
    <Tab.Screen
      name="HomeTabScreen"
      component={HomeStackScreen}
      options={{
        tabBarLabel: props => <Text style={{color: props.color}}>Home</Text>,
        tabBarIcon: props => (
          <Ionicons name="home-outline" size={24} color={props.color} />
        ),
      }}
    />
    <Tab.Screen
      name="SavedAdsTabScreen"
      component={SavedAdsStackScreen}
      options={{
        tabBarLabel: props => (
          <Text style={{color: props.color}}>Saved Ads</Text>
        ),
        tabBarIcon: props => (
          <Ionicons name="heart-outline" size={24} color={props.color} />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTabScreen"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: props => <Text style={{color: props.color}}>Profile</Text>,
        tabBarIcon: props => (
          <Ionicons name="person-outline" size={24} color={props.color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default CustomNavigation;

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="Home" component={Home} />
    <HomeStack.Screen name="Service" component={Service} />
  </HomeStack.Navigator>
);

const SavedAdsStackScreen = ({navigation}) => (
  <SavedAdsStack.Navigator screenOptions={{headerShown: false}}>
    <SavedAdsStack.Screen name="SavedAds" component={SavedAds} />
  </SavedAdsStack.Navigator>
);

const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator screenOptions={{headerShown: false}}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);
