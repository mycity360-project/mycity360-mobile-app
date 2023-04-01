import {StyleSheet, View, Image, TextInput} from 'react-native';
import React from 'react';
import CustomButton from '../shared/components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import {useContext} from 'react';
export default function VerifyOtp() {
  const {showVerifyOtpScreen, isVerified} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <CustomButton btnType="back" onpress={() => navigation.goBack()} /> */}
      </View>
      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Enter Mobile OTP" />
        <CustomButton
          btnTitle={'Verify'}
          onpress={() => {
            isVerified(true);
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
