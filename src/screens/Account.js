import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {AuthContext} from '../context/AuthContext';
export default function Account() {
  const {logout} = useContext(AuthContext);
  return (
    <View>
      <Text>Account</Text>
      <CustomButton btnTitle="Logout" onpress={() => logout()} />
    </View>
  );
}

const styles = StyleSheet.create({});
