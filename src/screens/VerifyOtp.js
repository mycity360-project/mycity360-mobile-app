import {StyleSheet, View, TextInput, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import {useContext} from 'react';
import {http} from '../shared/lib';
import {BACKEND_CLIENT_ID} from '../shared/constants/env';

export default function VerifyOtp({route}) {
  const {userid} = route.params;
  const {isVerified} = useContext(AuthContext);
  const [enteredOtp, setEnteredOtp] = useState('');

  const verifyOtp = async otp => {
    try {
      const url = `user/${userid}/verify-otp/`;
      const config = {
        headers: {
          clientid: BACKEND_CLIENT_ID,
        },
      };
      const data = {
        phone_otp: otp,
      };

      const resp = await http.post(url, data, config);
      return resp;
    } catch (err) {}
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <CustomButton btnType="back" onpress={() => navigation.goBack()} /> */}
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile OTP"
          keyboardType="numeric"
          onChangeText={otp => setEnteredOtp(otp)}
        />
        <CustomButton
          btnTitle={'Verify'}
          onpress={async () => {
            let data = await verifyOtp(enteredOtp);
            isVerified(data);
          }}
        />
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
  },
});
