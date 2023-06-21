/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {React, useContext, useState, useRef} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { http } from '../shared/lib';
import { BACKEND_CLIENT_ID } from '../shared/constants/env';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailError, setEmailError] = useState(false);
  const [isPhoneError, setPhoneError] = useState(false);
  const [ispasswordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {login} = useContext(AuthContext);
  const passwordRef = useRef();
  const navigation = useNavigation();

  const errors = {
    password: 'Password must be atleast 8 characters',
    phone: 'Please enter valid phone number',
    email: 'Please enter the valid email',
  };

  const loginHandler = async () => {
    setIsLoading(true);
    var phoneRegex = /^\d{10}$/;
    var emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.length === 10 && !email.match(phoneRegex)) {
      setEmailError(false);
      setPhoneError(true);
      setIsLoading(false);
      return;
    }

    if (email.length !== 10 && !email.match(emailRegex)) {
      setPhoneError(false);
      setEmailError(true);
      setIsLoading(false);
      return;
    }

    if (password === '' || password.length < 8) {
      setEmailError(false);
      setPhoneError(false);
      setPasswordError(true);
      setIsLoading(false);

      return;
    }

    const url = 'user/login/';
    const config = {
      headers: {
        clientid: BACKEND_CLIENT_ID,
      },
    };
    const data = {
      email: email,
      password: password,
    };

    let respData = await http.post(url, data, config);

    if (respData?.access_token) {
      await login(data.email, data.password);
    } else {
      navigation.navigate('VerifyOtp', {
        userid: respData.id,
        is_email_verified: respData.is_email_verified,
        is_phone_verified: respData.is_phone_verified,
      });
    }
    setIsLoading(false);
  };

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        scrollEnabled={false}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.innerContainer}>
          <View style={styles.headerSection} />
          <View style={styles.logoSection}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{width: 75, height: 75}}
            />
            <Text allowFontScaling={false} style={styles.logoName}>
              MyCity360
            </Text>
          </View>
          <View style={styles.loginFormSection}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 24,
                fontWeight: '400',
                color: '#FF8C00',
                textAlign: 'center',
              }}>
              Login
            </Text>
            <TextInput
              allowFontScaling={false}
              placeholder="Enter Email / Mobile Number"
              placeholderTextColor="grey"
              style={styles.input}
              autoCapitalize="none"
              onChangeText={mail => {
                setEmail(mail);
              }}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current.focus()}
            />
            {isEmailError ? (
              <Text allowFontScaling={false} style={styles.error}>
                {errors.email}
              </Text>
            ) : (
              ''
            )}
            {isPhoneError ? (
              <Text allowFontScaling={false} style={styles.error}>
                {errors.phone}
              </Text>
            ) : (
              ''
            )}
            <TextInput
              allowFontScaling={false}
              placeholder="Enter Password"
              placeholderTextColor="grey"
              style={styles.input}
              autoCapitalize="none"
              secureTextEntry={true}
              returnKeyType="send"
              onChangeText={value => {
                setPassword(value);
              }}
              onSubmitEditing={loginHandler}
              ref={passwordRef}
            />
            {ispasswordError ? (
              <Text allowFontScaling={false} style={styles.error}>
                {errors.password}
              </Text>
            ) : (
              ''
            )}

            <CustomButton
              btnTitle="Login"
              onpress={() => {
                loginHandler();
              }}
              style={styles.loginBtn}
              icon="arrow-forward"
            />

            <View
              style={{
                flex: 0.1,
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 5,
              }}>
              <Text allowFontScaling={false} style={{fontSize: 16}}>
                Need an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 16,
                    color: '#FA8C00',
                  }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  innerContainer: {
    flex: 1,
  },
  headerSection: {flex: 0.5},
  logoSection: {
    flex: 1,
    alignItems: 'center',
  },
  loginFormSection: {
    flex: 5,
    justifyContent: 'center',
  },

  input: {
    width: '76%',
    marginTop: '3%',
    marginHorizontal: '12%',
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    padding: 10,
    elevation: 5, //Android Only
    shadowRadius: 14, // IOS Only
  },
  logoName: {
    color: '#FA8C00',
    fontSize: 24,
    padding: 5,
  },
  loginBtn: {
    marginTop: '2%',
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
