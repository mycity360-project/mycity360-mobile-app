import {StyleSheet, Text, View} from 'react-native';
import {React, useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import CustomButton from '../shared/components/CustomButton';
export default function Home() {
  const {logout} = useContext(AuthContext);
  return (
    <View>
      <Text>Home</Text>
      <CustomButton
        btnTitle="Logout"
        onpress={() => {
          logout();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
