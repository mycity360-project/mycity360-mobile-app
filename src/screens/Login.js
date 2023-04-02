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
  const {login} = useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.headerSection}></View>
          <View style={styles.logoSection}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{width: 75, height: 75}}
            />
            <Text style={styles.logoName}>MyCity360</Text>
          </View>
          <View style={styles.loginFormSection}>
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
              onChangeText={email => {
                setEmail(email);
              }}
            />
            <TextInput
              placeholder="Enter Password"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={password => {
                setPassword(password);
              }}
            />
            <CustomButton
              btnTitle="Login"
              onpress={async () => {
                const response = await login(email, password);
                console.log(response);
                response.showVerifyOtpScreen
                  ? navigation.navigate('VerifyOtp', {userid: response.userid})
                  : '';
              }}
              style={styles.loginBtn}
              icon="arrow-forward"
            />

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 1,
                }}>
                Need an account? <Text style={{color: '#FA8C00'}}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
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
  headerSection: {flex: 0.5},
  logoSection: {
    flex: 1,
    alignItems: 'center',
  },
  loginFormSection: {
    flex: 5,
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
