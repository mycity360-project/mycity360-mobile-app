import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import React from 'react';
import Button from '../components/Button';
export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/images/logo.png')}></Image>
      </View>

      <View style={styles.btnContainer}>
        <Button
          btnTitle={'Sign Up'}
          screenName={'SignUp'}
          btnStyle={styles.btn}
          btnTextStyle={styles.btnTitle}
        />
        <Button
          btnTitle={'Login'}
          screenName={'Login'}
          btnStyle={{...styles.btn, marginTop: '5%'}}
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
  btnContainer: {
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
});
