import {StyleSheet, Image} from 'react-native';
import React from 'react';
import logo from '../../assets/images/logo.png';

export default function Logo() {
  return <Image style={styles.logo} source={logo} />;
}

const styles = StyleSheet.create({});
