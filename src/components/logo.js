import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function Logo() {
  return (
    <Image
      style={styles.logo}
      source={require('../assets/images/logo.png')}></Image>
  );
}

const styles = StyleSheet.create({});
