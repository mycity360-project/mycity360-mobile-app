import {React, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {AuthContext} from '../context/AuthContext';
import {ActivityIndicator, Dimensions, View, Image} from 'react-native';

export default function AppNav() {
  const {isLoading, userToken = null} = useContext(AuthContext);
  const {width, height} = Dimensions.get('window');

  if (isLoading) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{flex: 1}}>
        <Image
          style={{width: width, height: height}}
          source={require('../assets/images/splash.jpeg')}
        />
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
