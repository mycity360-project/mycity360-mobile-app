/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {React, useContext, useState} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

export default function Login() {
  const {login} = useContext(AuthContext);

  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState(null);
  const [isEmailError, setEmailError] = useState(false);
  const [isPhoneError, setPhoneError] = useState(false);
  const [ispasswordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

    if (password === '' || password.length < 8) {
      setIsLoading(false);
      setPasswordError(true);
      return;
    }

    if (email.length === 10 && !email.match(phoneRegex)) {
      setEmailError(false);
      setIsLoading(false);
      setPhoneError(true);
      return;
    }

    if (email.length !== 10 && !email.match(emailRegex)) {
      setPhoneError(false);
      setIsLoading(false);
      setEmailError(true);
      return;
    }

    const response = await login(email, password);
    if (response?.showVerifyOtpScreen) {
      setIsLoading(false);
      navigation.navigate('VerifyOtp', {userid: response.userid});
    }
    setIsLoading(false);
  };

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.headerSection} />
          <View style={styles.logoSection}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{width: 75, height: 75}}
            />
            <Text style={styles.logoName}>MyCity360</Text>
          </View>
          <View style={styles.loginFormSection}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '400',
                color: '#FF8C00',
                textAlign: 'center',
              }}>
              Login
            </Text>
            <TextInput
              placeholder="Enter Email / Mobile Number"
              style={styles.input}
              autoCapitalize="none"
              onChangeText={mail => {
                setEmail(mail);
              }}
            />
            {isEmailError ? (
              <Text style={styles.error}>{errors.email}</Text>
            ) : (
              ''
            )}
            {isPhoneError ? (
              <Text style={styles.error}>{errors.phone}</Text>
            ) : (
              ''
            )}
            <TextInput
              placeholder="Enter Password"
              style={styles.input}
              autoCapitalize="none"
              secureTextEntry={true}
              returnKeyType="send"
              onChangeText={value => {
                setPassword(value);
              }}
            />
            {ispasswordError ? (
              <Text style={styles.error}>{errors.password}</Text>
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
              <Text style={{fontSize: 16}}>Need an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text
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
      </TouchableWithoutFeedback>
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
    shadowRadius: 5, // IOS Only
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
