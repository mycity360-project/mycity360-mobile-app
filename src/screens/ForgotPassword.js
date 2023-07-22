/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {React, useState} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {http} from '../shared/lib';

export default function ForgotPassword({route, navigation}) {
  const [email, setEmail] = useState(route.params.email);
  const [isEmailError, setEmailError] = useState(false);
  const [isPhoneError, setPhoneError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const errors = {
    phone: 'Please enter valid phone number',
    email: 'Please enter the valid email',
  };

  const forgotPasswordHadler = async () => {
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

    const url = 'user/forgot-password/';
    const data = {
      key: email,
    };
    try {
      let respData = await http.post(url, data);
      navigation.navigate('ResetPassword', respData);
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        'Something Went Wrong, We are working on it. Please try after Some time';
      Alert.alert('ERROR', `${msg}`, [{text: 'OK'}]);
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
          <View style={styles.formSection}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 24,
                fontWeight: '400',
                color: '#FF8C00',
                textAlign: 'center',
              }}>
              Forgot Password
            </Text>
            <TextInput
              allowFontScaling={false}
              placeholder="Enter Email / Mobile Number"
              placeholderTextColor="grey"
              style={styles.input}
              autoCapitalize="none"
              value={email}
              onChangeText={mail => {
                setEmail(mail);
              }}
              onSubmitEditing={forgotPasswordHadler}
              returnKeyType="next"
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

            <CustomButton
              btnTitle="Next"
              onpress={() => {
                forgotPasswordHadler();
              }}
              style={styles.nextBtn}
              icon="arrow-forward"
            />
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
    flex: 0.2,
    alignItems: 'center',
  },
  formSection: {
    flex: 6,
    justifyContent: 'center',
    // backgroundColor: '#999',
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
  nextBtn: {
    marginTop: '2%',
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
