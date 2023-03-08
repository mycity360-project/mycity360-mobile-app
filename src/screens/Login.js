import {
  StyleSheet,
  View,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React from 'react';
import {Button} from '../shared/components';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        scrollEnabled={false}
        contentContainerStyle={{flexGrow: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <Text>Back</Text>
            </View>
            <View style={styles.imgContainer}>
              <Image
                source={require('../assets/images/logo.png')}
                style={{width: 75, height: 75}}
              />
              <Text>MyCity360</Text>
            </View>
            <View style={styles.loginFormContainer}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 24,
                  fontWeight: '500',
                  color: '#FF8C00',
                  textAlign: 'center',
                }}>
                Login
              </Text>
              <TextInput placeholder="Mobile Number" style={styles.input} />
              <Button
                btnTitle="Login"
                screenName="VerifyOtp"
                style={styles.btn}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  innerContainer: {
    flex: 1,
    marginHorizontal: '2%',
  },
  imgContainer: {
    flex: 3,
    alignItems: 'center',
  },
  loginFormContainer: {flex: 4},
  header: {flex: 1},
  input: {
    width: '75%',
    marginTop: 20,
    marginHorizontal: '11.5%',
    borderWidth: 0.5,
    borderColor: '#FA8C00',
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  btn: {
    marginTop: 10,
  },
});
