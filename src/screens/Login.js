import {
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {React, useContext, useState} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

export default function Login() {
  const {login, showVerifyOtpScreen} = useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <CustomButton btnType="back" onpress={() => navigation.goBack()} />
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
              onChangeText={text => {
                setEmail(text);
              }}
            />
            <TextInput
              placeholder="Enter Password"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={text => {
                setPassword(text);
              }}
            />
            <CustomButton
              btnTitle="Login"
              onpress={async () => {
                (await login(email, password))
                  ? navigation.navigate('VerifyOtp')
                  : '';
              }}
              style={styles.loginBtn}
              icon="arrow-forward"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    marginTop: '3%',
    marginHorizontal: '12%',
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    padding: 10,
    elevation: 5, //Android Only
    shadowRadius: 5, // IOS Only
  },
  logoName: {
    color: '#FA8C00',
    fontSize: 24,
    padding: 5,
  },
  loginBtn: {
    marginTop: '2%',
  },
});
