import {React, createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import {BACKEND_CLIENT_ID} from '../shared/constants/env';
import {Alert} from 'react-native';
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const onTokenAvailable = async (respData, token, userid) => {
    let user = await http.get(`user/${userid}/`, {
      headers: {
        clientid: BACKEND_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    user = {...user, localUserArea: user.area};
    setUserInfo(user);
    AsyncStorage.setItem('tokenInfo', JSON.stringify(respData));
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('userInfo', JSON.stringify(user));
    AsyncStorage.setItem('userID', JSON.stringify(userid));
    setUserToken(token);
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

      if (token) {
        await onTokenAvailable(respData, token, userid);
        setIsLoading(false);
        // response.showVerifyOtpScreen = false;
      } else {
        response.showVerifyOtpScreen = true;
        response.userid = userid;
        setIsLoading(false);
        return response;
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response.status === 500) {
        Alert.alert('ERROR', 'User not exist ', [{text: 'OK'}]);
      } else if (error.response.status === 400) {
        Alert.alert('ERROR', 'Check Your username OR password', [{text: 'OK'}]);
      } else {
        Alert.alert('ERROR', 'Something Went Wrong', [{text: 'OK'}]);
      }
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.clear();
    setIsLoading(false);
  };

  const isVerified = async respData => {
    try {
      setIsLoading(true);
      await onTokenAvailable(respData, respData.access_token, respData.user_id);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Something Went Wrong', [{text: 'OK'}]);
    }
  };
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let token = await AsyncStorage.getItem('token');
      let user = await AsyncStorage.getItem('userInfo');
      setUserInfo(JSON.parse(user));
      setUserToken(token);
      setIsLoading(false);
    } catch (e) {
      // Alert.alert('ERROR', 'User is not logged In', [{text: 'OK'}]);
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
        userInfo,
        setUserInfo,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
