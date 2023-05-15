/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState, useRef} from 'react';
import CustomButton from '../shared/components/CustomButton';
import DropDown from '../shared/components/DropDown';
import {useNavigation} from '@react-navigation/native';
import {http} from '../shared/lib';
import {BACKEND_CLIENT_ID} from '../shared/constants/env';
import {AuthContext} from '../context/AuthContext';
import * as Yup from 'yup';
import {Formik} from 'formik';

export default function SignUp() {
  const navigation = useNavigation();
  const {login} = useContext(AuthContext);
  const [locationData, setLocationData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLocationError, setShowLocationError] = useState(false);
  const [showAreaError, setShowAreaError] = useState(false);

  const lastNameRef = useRef();
  const mobileRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const getLocations = async () => {
    setIsLoading(true);
    try {
      let locationRespdata = await http.get('location/public/?isactive=true');

      const locations = locationRespdata.map(location => ({
        key: location.id.toString(),
        value: location.name,
      }));
      setLocationData(locations);
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        'Something Went Wrong, We are working on it. Please try after Some time';
      Alert.alert('ERROR', `${msg}`, [{text: 'OK'}]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  const getAreas = async location => {
    setIsLoading(true);
    try {
      let areaRespData = await http.get(
        `area/public/?location_id=${location.key}`,
      );

      const areas = areaRespData.map(area => ({
        key: area.id.toString(),
        value: area.name,
      }));

      setAreaData(areas);
      setIsDisabled(false);
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        'Something Went Wrong, We are working on it. Please try after Some time';
      Alert.alert('ERROR', `${msg}`, [{text: 'OK'}]);
    } finally {
      setIsLoading(false);
    }
  };

  const setLocation = async location => {
    setSelectedLocation(location);
    setShowLocationError(false);
    await getAreas(location);
  };
  const setArea = async area => {
    setSelectedArea(area);
    setShowAreaError(false);
  };

  const handleOnSignUpPress = async () => {
    try {
      setIsLoading(true);
      let data = {
        email: email,
        phone: mobileNumber,
        password: password,
        first_name: firstName,
        last_name: lastName,
        area: {id: selectedArea.key},
      };

      const config = {
        headers: {
          clientid: BACKEND_CLIENT_ID,
        },
      };

      const resp = await http.post('user/signup/', data, config);

      const user_id = resp.id;
      if (user_id) {
        resp.is_phone_verified
          ? await login(email, password)
          : navigation.navigate('VerifyOtp', {userid: user_id});
      } else {
        throw new Error('Not able to get UserId Something went wrong');
      }
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        'Something Went Wrong, We are working on it. Please try after Some time';
      Alert.alert('ERROR', `${msg}`, [{text: 'OK'}]);
    } finally {
      setIsLoading(false);
    }
  };

  const focusNextInput = nextInput => {
    nextInput.current?.focus();
  };

  const signUpValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name Required'),
    lastName: Yup.string().required('Last Name Required'),
    mobileNumber: Yup.string()
      .min(10, 'Mobile Number must be of 10 digits')
      .max(10, 'Mobile Number can not have more than 10 digits.')
      .required('Please Enter Mobile Number'),
    email: Yup.string()
      .email('Please Enter Valid Email')
      .required('Please Enter Email Address'),
    password: Yup.string()
      .min(8, ({min}) => `Password must be atleast ${min} characters`)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
      )
      .required('Please Enter Password'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please Enter Confirm Password'),
  });

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <Formik
      initialValues={{
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      }}
      onSubmit={() => {
        if (selectedLocation == '') {
          setShowLocationError(true);
        } else if (selectedArea == '') {
          setShowAreaError(true);
        } else {
          setShowLocationError(false);
          setShowAreaError(false);
          handleOnSignUpPress();
        }
      }}
      validationSchema={signUpValidationSchema}>
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
              <View style={styles.header} />

              <View style={styles.registerFormContainer}>
                <Text
                  allowFontScaling={false}
                  style={styles.registerFormHeading}>
                  Register
                </Text>
                <View style={styles.nameInputContainer}>
                  <TextInput
                    allowFontScaling={false}
                    style={[
                      styles.nameInput,
                      styles.inputCommon,
                      {marginLeft: '10%'},
                    ]}
                    placeholder="First Name"
                    value={values.firstName}
                    onBlur={() => {
                      setFirstName(values.firstName);
                      handleBlur('firstName');
                    }}
                    onChangeText={handleChange('firstName')}
                    autoFocus={true}
                    returnKeyType="next"
                    onSubmitEditing={() => focusNextInput(lastNameRef)}
                  />

                  <TextInput
                    allowFontScaling={false}
                    placeholder="Last Name"
                    style={[
                      styles.nameInput,
                      styles.inputCommon,
                      {marginRight: '10%'},
                    ]}
                    value={values.lastName}
                    onBlur={() => {
                      setLastName(values.lastName);
                      handleBlur('lastName');
                    }}
                    onChangeText={handleChange('lastName')}
                    ref={lastNameRef}
                    returnKeyType="next"
                    onSubmitEditing={() => focusNextInput(mobileRef)}
                  />
                </View>
                {errors.firstName && touched.firstName && (
                  <Text allowFontScaling={false} style={styles.error}>
                    {errors.firstName}
                  </Text>
                )}
                {errors.lastName && touched.lastName && (
                  <Text allowFontScaling={false} style={styles.error}>
                    {errors.lastName}
                  </Text>
                )}
                <TextInput
                  allowFontScaling={false}
                  placeholder="Enter Mobile Number"
                  style={[styles.input, styles.inputCommon]}
                  keyboardType="numeric"
                  value={values.mobileNumber}
                  onBlur={() => {
                    setMobileNumber(values.mobileNumber);
                    handleBlur('mobileNumber');
                  }}
                  onChangeText={handleChange('mobileNumber')}
                  ref={mobileRef}
                  returnKeyType="next"
                  onSubmitEditing={() => focusNextInput(emailRef)}
                />
                {errors.mobileNumber && touched.mobileNumber && (
                  <Text allowFontScaling={false} style={styles.error}>
                    {errors.mobileNumber}
                  </Text>
                )}
                <TextInput
                  allowFontScaling={false}
                  placeholder="Enter you email"
                  style={[styles.input, styles.inputCommon]}
                  autoCapitalize={'none'}
                  keyboardType="email-address"
                  onBlur={() => {
                    setEmail(values.email);
                    handleBlur('email');
                  }}
                  onChangeText={handleChange('email')}
                  value={values.email}
                  ref={emailRef}
                  returnKeyType="next"
                  onSubmitEditing={() => focusNextInput(passwordRef)}
                />
                {errors.email && touched.email && (
                  <Text allowFontScaling={false} style={styles.error}>
                    {errors.email}
                  </Text>
                )}
                <TextInput
                  allowFontScaling={false}
                  style={[styles.input, styles.inputCommon]}
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  onBlur={() => {
                    setPassword(values.password);
                    handleBlur('password');
                  }}
                  onChangeText={handleChange('password')}
                  value={values.password}
                  ref={passwordRef}
                  returnKeyType="next"
                  onSubmitEditing={() => focusNextInput(confirmPasswordRef)}
                />

                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 10,
                    color: '#666',
                    marginHorizontal: '14%',
                    marginTop: 1,
                  }}>
                  Allowed Special Characters @,$,!,%,*,?,&,#
                </Text>
                {errors.password && touched.password && (
                  <Text allowFontScaling={false} style={styles.error}>
                    {errors.password}
                  </Text>
                )}
                <TextInput
                  allowFontScaling={false}
                  style={[styles.input, styles.inputCommon]}
                  placeholder="Confirm password"
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  onBlur={() => {
                    setConfirmPassword(values.confirmPassword);
                    handleBlur('confirmPassword');
                  }}
                  onChangeText={handleChange('confirmPassword')}
                  value={values.confirmPassword}
                  ref={confirmPasswordRef}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text allowFontScaling={false} style={styles.error}>
                    {' '}
                    {errors.confirmPassword}
                  </Text>
                )}
                <DropDown
                  placeholder="Select Location"
                  dataArray={locationData}
                  selectedDataHandler={location => setLocation(location)}
                  isDisabled={false}
                  selectedValue={selectedLocation}
                />
                {showLocationError ? (
                  <Text allowFontScaling={false} style={styles.error}>
                    Please Select Location
                  </Text>
                ) : (
                  ''
                )}
                <DropDown
                  placeholder="Select Area"
                  dataArray={areaData}
                  isDisabled={isDisabled}
                  selectedDataHandler={area => setArea(area)}
                  selectedValue={selectedArea}
                />
                {showAreaError ? (
                  <Text allowFontScaling={false} style={styles.error}>
                    Please Select Area
                  </Text>
                ) : (
                  ''
                )}
                <CustomButton
                  btnTitle={'Sign Up'}
                  style={styles.registerBtn}
                  icon="arrow-forward"
                  onpress={handleSubmit} //async () => await handleOnSignUpPress()
                />
                <View
                  style={{
                    flex: 0.4,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 5,
                  }}>
                  <Text allowFontScaling={false} style={{fontSize: 16}}>
                    Already Registered?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 16,
                        color: '#FA8C00',
                      }}>
                      Login
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
  registerFormContainer: {
    flex: 4,
    justifyContent: 'flex-start',
    marginTop: '4%',
  },
  registerFormHeading: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FF8C00',
    textAlign: 'center',
  },

  input: {
    width: '76%',
    marginTop: '3%',
    marginHorizontal: '12%',
  },
  inputCommon: {
    backgroundColor: '#efefef',
    borderRadius: 20,
    padding: 10,
    elevation: 5, //Android Only
    shadowRadius: 5, // IOS Only
  },
  registerBtn: {
    marginTop: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: '3%',
  },
  nameInput: {
    width: '36%',
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
