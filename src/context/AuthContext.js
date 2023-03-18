import {React, createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    const data = {
      email: username,
      password: password,
    };

    try {
      let respData = await http.post('user/login/', data);
      console.log(respData);
      const token = respData.access_token;
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
