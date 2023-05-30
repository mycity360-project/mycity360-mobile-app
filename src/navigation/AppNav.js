import {React, useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {AuthContext} from '../context/AuthContext';
import {ActivityIndicator, View} from 'react-native';
import InternetConnection from '../shared/components/InternetConnection';
export default function AppNav() {
  const {isLoading, userToken = null} = useContext(AuthContext);

  if (isLoading) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  if (userToken === null || userToken === '') {
    return (
      <NavigationContainer>
        <InternetConnection />
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <InternetConnection />
      <AppStack />
    </NavigationContainer>
  );
}
