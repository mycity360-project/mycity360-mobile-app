/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState, useRef} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import {http} from '../shared/lib';
import {BACKEND_URL, BACKEND_CLIENT_ID} from '../shared/constants/env';
import {AuthContext} from '../context/AuthContext';
import * as Yup from 'yup';
import {Formik} from 'formik';

export default function ResetPassword({route}) {
  console.log(route.params, '25 reset');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lastOTPSentTime, setLastOTPSentTime] = useState(new Date().getTime());

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const focusNextInput = nextInput => {
    nextInput.current?.focus();
  };

  const signUpValidationSchema = Yup.object().shape({
    otp: Yup.string().required('Please Enter OTP'),
    newPassword: Yup.string()
      .min(8, ({min}) => `Password must be atleast ${min} characters`)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
      )
      .required('Please Enter Password'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please Enter Confirm Password'),
  });

  const resetPasswordHandler = async formData => {
    const url = 'user/reset-password/';
    const data = {
      ...route.params,
      otp: formData.otp,
      password: formData.newPassword,
    };
    try {
      let respData = await http.post(url, data);

      Alert.alert('SUCCESS', `${respData.message}`, [
        {
          text: 'Login',
          onPress: () => {
            navigation.reset({
              index: 0,
              actions: [navigation.navigate('Login')],
            });
          },
        },
      ]);
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        'Something Went Wrong, We are working on it. Please try after Some time';
      Alert.alert('ERROR', `${msg}`, [{text: 'OK'}]);
    }
  };
  const handleResendOTP = async () => {
    const currentTime = new Date().getTime();
    const timeSinceLastOTPSent = currentTime - lastOTPSentTime;
    console.log(timeSinceLastOTPSent);

    if (timeSinceLastOTPSent < 60000) {
      console.log('inside if');
      Alert.alert('Resend OTP', 'You can resend OTP after 1 minute');
    } else {
      console.log('inside else');
      try {
        const url = 'user/forgot-password/';
        const data = {
          key: route.params.email,
        };
        await http.post(url, data);
      } catch (error) {
        const msg =
          error?.response?.data?.detail ||
          'Something Went Wrong, We are working on it. Please try after Some time';
        Alert.alert('ERROR', `${msg}`, [{text: 'OK'}]);
      }
      setLastOTPSentTime(new Date().getTime());
    }
  };

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <Formik
      initialValues={{
        otp: otp,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      }}
      validationSchema={signUpValidationSchema}
      onSubmit={values => {
        resetPasswordHandler(values);
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        isValid,
        touched,
        errors,
      }) => (
        <SafeAreaView style={styles.container}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            scrollEnabled={false}
            contentContainerStyle={{flexGrow: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.innerContainer}>
                <View style={styles.registerFormContainer}>
                  <Text
                    allowFontScaling={false}
                    style={styles.registerFormHeading}>
                    Reset Password
                  </Text>

                  <TextInput
                    allowFontScaling={false}
                    placeholder="OTP"
                    placeholderTextColor="grey"
                    style={[styles.input, styles.inputCommon]}
                    keyboardType="numeric"
                    value={values.otp}
                    onBlur={() => {
                      setOtp(values.otp);
                      handleBlur('otp');
                    }}
                    autoFocus={true}
                    onChangeText={handleChange('otp')}
                    returnKeyType="next"
                    onSubmitEditing={() => focusNextInput(passwordRef)}
                  />
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 10,
                      color: '#666',
                      marginHorizontal: '14%',
                      marginTop: 2,
                    }}>
                    OTP will expire in 2 minutes.
                  </Text>

                  <TouchableOpacity
                    onPress={handleResendOTP}
                    style={{
                      alignSelf: 'center',
                      marginTop: 10,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        color: '#FF8C00',
                      }}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>

                  {errors.otp && touched.otp && (
                    <Text allowFontScaling={false} style={styles.error}>
                      {errors.otp}
                    </Text>
                  )}

                  <TextInput
                    allowFontScaling={false}
                    style={[styles.input, styles.inputCommon]}
                    placeholder="New Password"
                    placeholderTextColor="grey"
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    onBlur={() => {
                      setNewPassword(values.newPassword);
                      handleBlur('newPassword');
                    }}
                    onChangeText={handleChange('newPassword')}
                    value={values.newPassword}
                    ref={passwordRef}
                    returnKeyType="next"
                    onSubmitEditing={() => focusNextInput(confirmPasswordRef)}
                  />

                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 10,
                      color: '#666',
                      marginHorizontal: '14%',
                      marginTop: 2,
                    }}>
                    Allowed Special Characters @,$,!,%,*,?,&,#
                  </Text>
                  {errors.newPassword && touched.newPassword && (
                    <Text allowFontScaling={false} style={styles.error}>
                      {errors.newPassword}
                    </Text>
                  )}
                  <TextInput
                    allowFontScaling={false}
                    style={[styles.input, styles.inputCommon]}
                    placeholder="Confirm password"
                    placeholderTextColor="grey"
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    onBlur={() => {
                      setConfirmPassword(values.confirmPassword);
                      handleBlur('confirmPassword');
                    }}
                    onChangeText={handleChange('confirmPassword')}
                    value={values.confirmPassword}
                    ref={confirmPasswordRef}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Text allowFontScaling={false} style={styles.error}>
                      {errors.confirmPassword}
                    </Text>
                  )}

                  <CustomButton
                    btnTitle="Submit"
                    style={styles.registerBtn}
                    icon="arrow-forward"
                    onpress={handleSubmit}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      )}
    </Formik>
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
  registerFormContainer: {
    flex: 4,
    justifyContent: 'center',
    marginTop: '4%',
  },
  registerFormHeading: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FF8C00',
    textAlign: 'center',
  },

  input: {
    width: '76%',
    marginTop: '3%',
    marginHorizontal: '12%',
  },
  inputCommon: {
    backgroundColor: '#efefef',
    borderRadius: 20,
    padding: 10,
    elevation: 5, //Android Only
    shadowRadius: 5, // IOS Only
  },
  registerBtn: {
    marginTop: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: '3%',
  },
  nameInput: {
    width: '36%',
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
