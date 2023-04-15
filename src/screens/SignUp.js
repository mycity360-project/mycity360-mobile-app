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
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import CustomButton from '../shared/components/CustomButton';
import DropDown from '../shared/components/DropDown';
import {useNavigation} from '@react-navigation/native';
import {http} from '../shared/lib';
import {BACKEND_CLIENT_ID} from '../shared/constants/env';
import {AuthContext} from '../context/AuthContext';

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

  const getLocations = async () => {
    setIsLoading(true);
    try {
      let locationRespdata = await http.get('location/public/?isactive=true');

      const locations = locationRespdata.map(location => ({
        key: location.id.toString(),
        value: location.name,
      }));
      console.log(selectedLocation);
      setLocationData(locations);
    } catch (error) {
      console.log('Something went wrong while fetching locations' + error);
    }
    setIsLoading(false);
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
      setIsLoading(false);
    } catch (error) {
      console.log('Something went wrong while fetching area' + error);
    }
  };

  const setLocation = async location => {
    setSelectedLocation(location);
    await getAreas(location);
  };
  const setArea = async area => {
    setSelectedArea(area);
  };

  const handleOnSignUpPress = async () => {
    try {
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
      // console.log(resp);
      const user_id = resp.id;
      if (user_id) {
        resp.is_phone_verified
          ? await login(email, password)
          : navigation.navigate('VerifyOtp', {userid: user_id});
      } else {
        throw new Error('Not able to get UserId Something went wrong');
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header} />

          <View style={styles.registerFormContainer}>
            <Text style={styles.registerFormHeading}>Register</Text>
            <View style={styles.nameInputContainer}>
              <TextInput
                style={[
                  styles.nameInput,
                  styles.inputCommon,
                  {marginLeft: '10%'},
                ]}
                placeholder="First Name"
                value={firstName}
                onChangeText={firstname => {
                  setFirstName(firstname);
                }}
              />
              <TextInput
                placeholder="Last Name"
                style={[
                  styles.nameInput,
                  styles.inputCommon,
                  {marginRight: '10%'},
                ]}
                value={lastName}
                onChangeText={lastname => {
                  setLastName(lastname);
                }}
              />
            </View>
            <TextInput
              placeholder="Enter Mobile Number"
              style={[styles.input, styles.inputCommon]}
              keyboardType="numeric"
              onChangeText={value => {
                setMobileNumber(value);
              }}
              value={mobileNumber}
            />
            <TextInput
              placeholder="Enter you email"
              style={[styles.input, styles.inputCommon]}
              autoCapitalize={'none'}
              keyboardType="email-address"
              onChangeText={mail => {
                setEmail(mail);
              }}
              value={email}
            />
            <TextInput
              style={[styles.input, styles.inputCommon]}
              placeholder="Enter your password"
              secureTextEntry={true}
              autoCapitalize={'none'}
              onChangeText={pass => {
                setPassword(pass);
              }}
              value={password}
            />
            <TextInput
              style={[styles.input, styles.inputCommon]}
              placeholder="Confirm password"
              secureTextEntry={true}
              autoCapitalize={'none'}
              onChangeText={confirmpass => {
                setConfirmPassword(confirmpass);
              }}
              value={confirmPassword}
            />
            <DropDown
              placeholder="Select Location"
              dataArray={locationData}
              selectedDataHandler={location => setLocation(location)}
              isDisabled={false}
              selectedValue={selectedLocation}
            />
            <DropDown
              placeholder="Select Area"
              dataArray={areaData}
              isDisabled={isDisabled}
              selectedDataHandler={area => setArea(area)}
              selectedValue={selectedArea}
            />
            {/* navigation.navigate('VerifyOtp') */}
            <CustomButton
              btnTitle={'Sign Up'}
              style={styles.registerBtn}
              icon="arrow-forward"
              onpress={async () => await handleOnSignUpPress()}
            />

            <View
              style={{
                flex: 0.1,
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 5,
              }}>
              <Text style={{fontSize: 16}}>Already Registered?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text
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
});
