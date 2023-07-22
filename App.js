/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {AuthProvider} from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import SplashScreen from './src/screens/SplashScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        {splashVisible ? <SplashScreen /> : <AppNav />}
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;
