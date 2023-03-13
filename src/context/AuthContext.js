import {React, createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import clientid from '../shared/clientid';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    const data = {
      email: username,
      password: password,
      client_id: 'IwVuiUsLcQmZ9eTpzf6RYgPCUDxWjdmDPTWMCMRH',
    };
    // console.log(data);

    try {
      let respData = await axios.post(
        'http://192.168.29.5:8000/api/v1/user/login/',
        data,
      );
      // console.log(typeof respData.data.is_email_verified);
      const token = respData.data.access_token;
      if (token) {
        setUserToken(token);
        AsyncStorage.setItem('userToken', token);
        setIsLoading(false);
      } else {
        // console.log('in else of login');
        setIsLoading(false);
        if (!respData.data.is_email_verified) {
          return true;
          // console.log('inside if');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      setUserToken(userToken);
      setIsLoading(false);
    } catch (e) {
      console.log(`isLoogedIn error ${e}`);
    }
  };
  useEffect(() => {
    isLoggedIn();
  }, []);
  return (
    <AuthContext.Provider value={{login, logout, isLoading, userToken}}>
      {children}
    </AuthContext.Provider>
  );
};
