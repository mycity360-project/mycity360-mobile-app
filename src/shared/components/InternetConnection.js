import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const InternetConnection = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const hasInternetConnection = state.isConnected;

      if (!hasInternetConnection && isConnected) {
        setIsConnected(false);
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection and try again.',
          [{text: 'OK', onPress: () => setIsConnected(true)}],
          {cancelable: false},
        );
      } else if (hasInternetConnection && !isConnected) {
        setIsConnected(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  return null;
};

export default InternetConnection;
