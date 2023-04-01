import {React, createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
//import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [showVerifyOtpScreen, setShowVerifyOtpScreen] = useState(false);

  const login = async (username, password) => {
    // setIsLoading(true);
    const url = 'user/login/';
    const config = {
      headers: {
        clientid: process.env.BACKEND_CLIENT_ID,
      },
    };
    const data = {
      email: username,
      password: password,
    };

    try {
      let respData = await http
        .post(url, data, config)
        .catch(err => console.log(err));
      const token = respData.access_token;
      const userid = respData.user_id;
      let userInfo = await http
        .get(`user/${userid}/`, {
          headers: {
            clientid: process.env.BACKEND_CLIENT_ID,
            Authorization: `Bearer ${token}`,
          },
        })
        .catch(err => console.log(err));
      console.log(respData, userInfo, 'resp from login & get user by id');

      if (respData && userInfo) {
        AsyncStorage.setItem('userTokenInfo', JSON.stringify(respData));
        AsyncStorage.setItem('userToken', token);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setShowVerifyOtpScreen(!userInfo.is_phone_verified);
        setUserToken(token);
        setIsLoading(false);
        return showVerifyOtpScreen;
      } else {
        // console.log('in else of login');
        setIsLoading(false);
        console.log('Some issue with the login AND/OR get user by id');
      }
    } catch (error) {
      console.log(JSON.stringify(error), 'err');
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };

  const isVerified = async verificationStatus => {
    try {
      setIsLoading(true);
      setShowVerifyOtpScreen(!verificationStatus);
      setIsLoading(false);
    } catch (e) {
      console.log(`isVerified error ${e}`);
    }
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
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoading,
        userToken,
        showVerifyOtpScreen,
        isVerified,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
