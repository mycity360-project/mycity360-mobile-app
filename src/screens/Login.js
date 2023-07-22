/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {React, useContext, useState, useRef} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {http} from '../shared/lib';
import {BACKEND_CLIENT_ID} from '../shared/constants/env';
import Loader from '../shared/components/Loader';
export default function Login({route}) {
  const [email, setEmail] = useState(route.params?.email || '');
  const [password, setPassword] = useState('');
  const [isEmailError, setEmailError] = useState(false);
  const [isPhoneError, setPhoneError] = useState(false);
  const [ispasswordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {onTokenAvailable} = useContext(AuthContext);
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

    if (email?.length === 10 && !email.match(phoneRegex)) {
      setEmailError(false);
      setPhoneError(true);
      setIsLoading(false);
      return;
    }

    if (email?.length !== 10 && !email.match(emailRegex)) {
      setPhoneError(false);
      setEmailError(true);
      setIsLoading(false);
      return;
    }

    if (password === '' || password?.length < 8) {
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
    try {
      let respData = await http.post(url, data, config);
      if (respData?.access_token) {
        await onTokenAvailable(
          respData,
          respData.access_token,
          respData.user_id,
        );
      } else {
        navigation.navigate('VerifyOtp', {
          userid: respData.id,
          is_email_verified: respData.is_email_verified,
          is_phone_verified: respData.is_phone_verified,
        });
      }
    } catch (error) {
      if (error.response.status === 500) {
        Alert.alert('ERROR', 'User not exist ', [{text: 'OK'}]);
      } else if (error.response.status === 400) {
        Alert.alert('ERROR', 'Check Your username OR password', [{text: 'OK'}]);
      } else {
        Alert.alert('ERROR', 'Something Went Wrong', [{text: 'OK'}]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              value={email}
              autoCapitalize="none"
              onChangeText={mail => {
                setEmail(mail);
              }}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current.focus()}
            />
            {isEmailError && (
              <Text allowFontScaling={false} style={styles.error}>
                {errors.email}
              </Text>
            )}
            {isPhoneError && (
              <Text allowFontScaling={false} style={styles.error}>
                {errors.phone}
              </Text>
            )}
            <TextInput
              allowFontScaling={false}
              placeholder="Enter Password"
              placeholderTextColor="grey"
              style={styles.input}
              value={password}
              autoCapitalize="none"
              secureTextEntry={true}
              returnKeyType="send"
              onChangeText={value => {
                setPassword(value);
              }}
              onSubmitEditing={loginHandler}
              ref={passwordRef}
            />
            {ispasswordError && (
              <Text allowFontScaling={false} style={styles.error}>
                {errors.password}
              </Text>
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
                flex: 0.02,
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 5,
              }}>
              <Text
                allowFontScaling={false}
                style={{fontSize: 16, color: '#111'}}>
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
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() =>
                navigation.navigate('ForgotPassword', {email: email})
              }>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  color: '#FA8C00',
                }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <Loader visible={isLoading} text="Logging you in.." />
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
    color: '#111',
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
