import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {Button} from '../shared/components';
export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/images/logo.png')}
        />
        <Text>MyCity360</Text>
      </View>

      <View style={styles.btnContainer}>
        <Button
          btnTitle={'Sign Up'}
          screenName={'SignUp'}
          btnTextStyle={styles.btnTitle}
        />
        <Button
          btnTitle={'Login'}
          screenName={'Login'}
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
});
