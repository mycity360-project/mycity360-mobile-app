import {StyleSheet, Text, View, Image, TextInput} from 'react-native';
import React from 'react';
import Button from '../components/Button';
export default function login() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/images/logo.png')}></Image>
      </View>

      <View style={styles.formContainer}>
        <TextInput style={styles.input} />
        <Button
          btnTitle={'Login'}
          screenName={'Login'}
          btnStyle={styles.btn}
          btnTextStyle={styles.btnTitle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  logoContainer: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logo: {width: '20%', height: '25%'},
  formContainer: {
    flex: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#FA8C00',
    borderRadius: 20,
    paddingVertical: 10,
    width: '75%',
    marginHorizontal: '12%',
  },
  btnTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  input: {
    width: '70%',
    height: '10%',
    marginHorizontal: '14%',
    borderWidth: 0.5,
    borderColor: '#FA8C00',
    marginBottom: '5%',
    borderRadius: 20,
  },
});
