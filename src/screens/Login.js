/* eslint-disable react-native/no-inline-styles */
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
import * as Yup from 'yup';
import {Formik} from 'formik';
export default function Login() {
  const {login} = useContext(AuthContext);
  const [emailOrPhone, setEmailOrPhone] = useState(null);
  const [password, setPassword] = useState(null);
  const [Loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const loginHandler = async () => {
    const response = await login(emailOrPhone, password);
    console.log(response, Loading);
    if (response.showVerifyOtpScreen) {
      navigation.navigate('VerifyOtp', {userid: response.userid});
    }
  };
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter valid Email')
      .required('Email/Phone is required'),
    mobileNumber: Yup.string()
      .min(10, 'Atleast 10')
      .required('Mobile Required'),
    password: Yup.string()
      .min(8, ({min}) => `Password must be atleast ${min} characters`)
      .required('Please Enter Password'),
  });

  return Loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <Formik
      initialValues={{mobileNumber: '', email: '', password: ''}}
      validateOnMount={true}
      validationSchema={loginValidationSchema}
      onSubmit={values => console.log(values, '57')}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        isValid,
        touched,
        errors,
      }) => (
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.innerContainer}>
              <View style={styles.headerSection} />
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
                  onChangeText={text => setEmailOrPhone(text)}
                />
                {errors.email && touched.email ? (
                  <Text style={styles.error}>{errors.email}</Text>
                ) : (
                  setEmailOrPhone(values.email)
                )}
                {errors.mobileNumber && touched.mobileNumber ? (
                  <Text style={styles.error}>{errors.mobileNumber}</Text>
                ) : (
                  setEmailOrPhone(values.mobileNumber)
                )}
                <TextInput
                  placeholder="Enter Password"
                  style={styles.input}
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                />
                {errors.password && touched.password ? (
                  <Text style={styles.error}>{errors.password}</Text>
                ) : (
                  setPassword(values.password)
                )}
                <CustomButton
                  btnTitle="Login"
                  onpress={handleSubmit}
                  style={styles.loginBtn}
                  icon="arrow-forward"
                />
                <View
                  style={{
                    flex: 0.1,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 5,
                  }}>
                  <Text style={{fontSize: 16}}>Need an account?</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#FA8C00',
                      }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      )}
    </Formik>
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
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
