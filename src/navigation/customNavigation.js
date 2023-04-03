import React from 'react';
import {Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Service from '../screens/Service';
import Home from '../screens/Home';
import SavedAds from '../screens/SavedAds';
import Account from '../screens/Account';

const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Service" component={Service} />
    </HomeStack.Navigator>
  );
};

const SavedAdsStack = createNativeStackNavigator();

const SavedAdsStackScreen = () => {
  return (
    <SavedAdsStack.Navigator screenOptions={{headerShown: false}}>
      <SavedAdsStack.Screen name="SavedAds" component={SavedAds} />
    </SavedAdsStack.Navigator>
  );
};

const AccountStack = createNativeStackNavigator();

const AccountStackScreen = () => {
  return (
    <AccountStack.Navigator screenOptions={{headerShown: false}}>
      <AccountStack.Screen name="Account" component={Account} />
    </AccountStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const iconSize = 24;
  return (
    <Tab.Navigator
      initialRouteName="HomeStackScreen"
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
            <Ionicons name="home-outline" size={iconSize} color={props.color} />
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
            <Ionicons
              name="heart-outline"
              size={iconSize}
              color={props.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AccountTabScreen"
        component={AccountStackScreen}
        options={{
          tabBarLabel: props => (
            <Text style={{color: props.color}}>Account</Text>
          ),
          tabBarIcon: props => (
            <Ionicons
              name="person-outline"
              size={iconSize}
              color={props.color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
