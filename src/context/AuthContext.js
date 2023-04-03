import {React, createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
//import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [showVerifyOtpScreen, setShowVerifyOtpScreen] = useState(false);

  const onTokenAvailable = async (respData, token, userid) => {
    console.log(token);
    let userInfo = await http.get(`user/${userid}/`, {
      headers: {
        clientid: process.env.BACKEND_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    setUserToken(token);
    AsyncStorage.setItem('userTokenInfo', JSON.stringify(respData));
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

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
      let respData = await http.post(url, data, config);
      const token = respData.access_token;
      const userid = token ? respData.user_id : respData.id;
      const response = {};
      console.log(respData, userid, 'resp from login & get user by id');

      if (token) {
        onTokenAvailable(respData, token, userid);
        setShowVerifyOtpScreen(false);
        response.showVerifyOtpScreen = false;
        setIsLoading(false);
      } else {
        console.log(showVerifyOtpScreen, ' before');
        let showScreen = true;
        setShowVerifyOtpScreen(showScreen);

        console.log(showVerifyOtpScreen, ' after');
        response.showVerifyOtpScreen = showScreen;
        response.userid = userid;
        setIsLoading(false);
      }
      return response;
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

  const isVerified = async respData => {
    try {
      setIsLoading(true);
      console.log(respData);
      onTokenAvailable(respData, respData.access_token, respData.user_id);
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
