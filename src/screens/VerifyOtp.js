import {StyleSheet, View, TextInput} from 'react-native';
import React, {useState} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import {useContext} from 'react';
import {http} from '../shared/lib';
import {BACKEND_CLIENT_ID} from '../shared/constants/env';

export default function VerifyOtp({route}) {
  const {userid} = route.params;
  console.log(route.params, 'route params');
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
      console.log(otp, userid, url, config, data);

      const resp = await http.post(url, data, config);
      console.log(resp, '24');
      return resp;
    } catch (err) {
      console.log(JSON.stringify(err), 'verifyotp');
    }
  };
  return (
    <View style={styles.container}>
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
            console.log(data);
            isVerified(data);
          }}
        />
      </View>
    </View>
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
