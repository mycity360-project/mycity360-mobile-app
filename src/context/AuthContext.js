import {React, createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import {BACKEND_CLIENT_ID} from '../shared/constants/env';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState('');

  const onTokenAvailable = async (respData, token, userid) => {
    let userInfo = await http.get(`user/${userid}/`, {
      headers: {
        clientid: BACKEND_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(userInfo);
    userInfo = {...userInfo, localUserArea: userInfo.area};
    setUserToken(token);
    AsyncStorage.setItem('tokenInfo', JSON.stringify(respData));
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    AsyncStorage.setItem('userID', JSON.stringify(userid));
  };

  const login = async (username, password) => {
    setIsLoading(true);
    const url = 'user/login/';
    const config = {
      headers: {
        clientid: BACKEND_CLIENT_ID,
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
        response.showVerifyOtpScreen = false;
        setIsLoading(false);
      } else {
        response.showVerifyOtpScreen = true;
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
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('tokenInfo');
    AsyncStorage.removeItem('userInfo');

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
      let token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
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
        isVerified,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
