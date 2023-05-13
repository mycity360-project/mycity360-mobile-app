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

function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>{splashVisible ? <SplashScreen /> : <AppNav />}</AuthProvider>
  );
}

export default App;
