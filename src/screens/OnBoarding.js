import {StyleSheet, Text, View, Image, SafeAreaView} from 'react-native';
import React from 'react';
import CustomButton from '../shared/components/CustomButton';
import {APP_TITLE} from '../shared/constants/env';

export default function OnBoarding({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header} />

      <View style={styles.imgContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logoImg}
        />
        <Text style={styles.logoName}>{APP_TITLE}</Text>
      </View>

      <View style={styles.btnContainer}>
        <CustomButton
          btnTitle={'Sign Up'}
          onpress={() => navigation.navigate('SignUp')}
          icon="arrow-forward"
        />
        <CustomButton
          btnTitle={'Login'}
          onpress={() => navigation.navigate('Login')}
          icon="arrow-forward"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {flex: 0.5},
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoName: {
    color: '#FA8C00',
    fontSize: 24,
    padding: 5,
  },
  logoImg: {width: 75, height: 75},
  btnContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
