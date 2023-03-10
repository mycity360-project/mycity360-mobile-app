import {StyleSheet, Text, View, Image, SafeAreaView} from 'react-native';
import React from 'react';
import {Button} from '../shared/components';
export default function HomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.imgContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logoImg}
        />
        <Text style={styles.logoName}>MyCity360</Text>
      </View>

      <View style={styles.btnContainer}>
        <Button
          btnTitle={'Sign Up'}
          screenName={'SignUp'}
          icon="arrow-forward"
        />
        <Button btnTitle={'Login'} screenName={'Login'} icon="arrow-forward" />
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
  },
});
