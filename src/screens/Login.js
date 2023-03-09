import {
  StyleSheet,
  View,
  Image,
  TextInput,
  Pressable,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React from 'react';
import Button from '../shared/components/Button';
import BackButton from '../shared/components/BackButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';

export default function Login() {
  // const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        scrollEnabled={true}
        extraHeight={150}
        contentContainerStyle={{flexGrow: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <BackButton />
            </View>
            <View style={styles.imgContainer}>
              <Image
                source={require('../assets/images/logo.png')}
                style={{width: 75, height: 75}}
              />
              <Text style={styles.logoName}>MyCity360</Text>
            </View>
            <View style={styles.loginFormContainer}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '400',
                  color: '#FF8C00',
                  textAlign: 'center',
                }}>
                Login
              </Text>
              <TextInput
                placeholder="Enter Mobile Number / Email"
                style={styles.input}
              />
              <TextInput
                placeholder="Enter Password"
                style={styles.input}
                secureTextEntry={true}
              />
              <Button
                btnTitle="Login"
                screenName="VerifyOtp"
                style={styles.loginBtn}
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
  },
  header: {flex: -1},
  imgContainer: {
    flex: -1,
    alignItems: 'center',
  },
  loginFormContainer: {
    flex: 4,

    justifyContent: 'center',
  },

  input: {
    width: '76%',
    marginTop: 20,
    marginHorizontal: '12%',
    borderWidth: 0.5,
    borderColor: '#FA8C00',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10,
  },
  logoName: {
    color: '#FA8C00',
    fontSize: 24,
    padding: 5,
  },
  loginBtn: {
    marginTop: '5%',
  },
});
