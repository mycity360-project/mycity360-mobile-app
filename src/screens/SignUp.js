/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import React, {useState} from 'react';
import Button from '../shared/components/Button';
import BackButton from '../shared/components/BackButton';

import DropDown from '../shared/components/DropDown';
export default function Signup() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Location 1', value: 'apple'},
    {label: 'Location 2', value: 'banana'},
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <BackButton />
          </View>

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
              />
              <TextInput
                placeholder="Last Name"
                style={[
                  styles.nameInput,
                  styles.inputCommon,
                  {marginRight: '10%'},
                ]}
              />
            </View>

            <TextInput
              placeholder="Enter Mobile Number"
              style={[styles.input, styles.inputCommon]}
            />
            <TextInput
              placeholder="Enter you email"
              style={[styles.input, styles.inputCommon]}
              autoCapitalize={'none'}
            />
            <TextInput
              style={[styles.input, styles.inputCommon]}
              placeholder="Enter your password"
              secureTextEntry={true}
              autoCapitalize={'none'}
            />
            <TextInput
              style={[styles.input, styles.inputCommon]}
              placeholder="Confirm password"
              secureTextEntry={true}
              autoCapitalize={'none'}
            />
            <DropDown
              dropdownType="Select Location"
              dataArr={['India', 'America', 'Russia', 'Japan', 'China']}
            />
            <DropDown
              dropdownType="Select Area"
              dataArr={['India', 'America', 'Russia', 'Japan', 'China']}
            />
            <Button
              btnTitle={'Sign Up'}
              screenName={'VerifyOtp'}
              style={styles.registerBtn}
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
