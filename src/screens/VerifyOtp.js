import {StyleSheet, View, Image, TextInput} from 'react-native';
import React from 'react';
import CustomButton from '../shared/components/CustomButton';
import {useNavigation} from '@react-navigation/native';
export default function VerifyOtp() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomButton btnType="back" onpress={() => navigation.goBack()} />
      </View>
      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Enter Mobile OTP" />
        <CustomButton
          btnTitle={'Verify'}
          onpress={() => navigation.navigate('OnBoarding')}
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
