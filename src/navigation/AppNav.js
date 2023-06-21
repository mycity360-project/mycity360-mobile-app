import {React, useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {AuthContext} from '../context/AuthContext';
import {ActivityIndicator, View, Image, Text} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function AppNav() {
  const {isLoading, userToken = null} = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const hasInternetConnection = state.isConnected;

      if (!hasInternetConnection && isConnected) {
        setIsConnected(false);
      } else if (hasInternetConnection && !isConnected) {
        setIsConnected(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  if (!isConnected) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../assets/icons/no-internet.png')}
          style={{width: 50, height: 50}}
        />
        <Text style={{color: '#111', fontSize: 14, fontWeight: 500}}>
          No Internet. Please check your connection.
        </Text>
      </View>
    );
  }

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
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
