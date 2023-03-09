import {StyleSheet, View, Image, TextInput} from 'react-native';
import React from 'react';
import Button from '../shared/components/Button';
import BackButton from '../shared/components/BackButton';

export default function VerifyOtp() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
      </View>
      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Enter Mobile OTP" />
        <Button btnTitle={'Verify'} screenName={'Home'} />
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
