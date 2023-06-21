import {StyleSheet, View, TextInput, SafeAreaView, Text} from 'react-native';
import React, {useState} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import {useContext} from 'react';
import {http} from '../shared/lib';
import {BACKEND_CLIENT_ID} from '../shared/constants/env';

export default function VerifyOtp({route}) {
  const {userid, is_email_verified, is_phone_verified} = route.params;
  // console.log(is_email_verified, is_phone_verified);
  const {isVerified} = useContext(AuthContext);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [enteredEmailOtp, setEnteredEmailOtp] = useState('');
  const [isError, setIsError] = useState(false);
  const [serverError, setServerError] = useState('');

  const verifyOtp = async (phone_otp, email_otp) => {
    const url = `user/${userid}/verify-otp/`;
    const config = {
      headers: {
        clientid: BACKEND_CLIENT_ID,
      },
    };
    const data = {
      ...(!!phone_otp && {phone_otp}),
      ...(!!email_otp && {email_otp}),
    };

    const resp = await http.post(url, data, config);
    return resp;
  };

  const handleButtonClick = async () => {
    try {
      let data = await verifyOtp(enteredOtp, enteredEmailOtp);
      isVerified(data);
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        'Something Went Wrong, We are working on it. Please try after Some time';
      setServerError(msg);
      setIsError(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header} />
      <View style={styles.formContainer}>
        {!is_phone_verified && (
          <TextInput
            allowFontScaling={false}
            style={styles.input}
            placeholder="Enter Mobile OTP"
            keyboardType="numeric"
            onChangeText={otp => setEnteredOtp(otp)}
          />
        )}
        {!is_email_verified && (
          <TextInput
            allowFontScaling={false}
            style={styles.input}
            placeholder="Enter Email OTP"
            keyboardType="numeric"
            onChangeText={otp => setEnteredEmailOtp(otp)}
          />
        )}
        <CustomButton
          btnTitle={'Verify'}
          onpress={async () => {
            await handleButtonClick();
          }}
        />
        {isError && (
          <Text allowFontScaling={false} style={styles.error}>
            {serverError}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {flex: -1},
  formContainer: {
    flex: 4,
    justifyContent: 'center',
  },

  input: {
    width: '76%',
    marginHorizontal: '12%',
    borderWidth: 0.5,
    borderColor: '#FA8C00',
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
