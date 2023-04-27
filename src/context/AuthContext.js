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
    // console.log(userInfo);
    user = {...user, localUserArea: user.area};
    setUserToken(token);
    setUserInfo(user);
    AsyncStorage.setItem('tokenInfo', JSON.stringify(respData));
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('userInfo', JSON.stringify(user));
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
      //console.log('inside login 43');
      let respData = await http.post(url, data, config);
      const token = respData.access_token;
      const userid = token ? respData.user_id : respData.id;
      const response = {};
      // console.log(respData, userid, 'resp from login & get user by id');

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
      console.log(error.response.status, '62');
      if (error.response.status == 500) {
        console.log(error.response.details, '64');
        Alert.alert('ERROR', 'User not exist ', [{text: 'OK'}]);
      } else if (error.response.status == 400) {
        console.log(error.response.details, '67');
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
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('tokenInfo');
    AsyncStorage.removeItem('userInfo');
    AsyncStorage.removeItem('userID');
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
      let token = await AsyncStorage.getItem('token');
      let user = await AsyncStorage.getItem('userInfo');
      console.log(token, 'context 88');
      setUserInfo(JSON.parse(user));
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
        userInfo,
        setUserInfo,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
