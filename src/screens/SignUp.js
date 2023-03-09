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
import DropDownPicker from 'react-native-dropdown-picker';
import React, {useState} from 'react';
import Button from '../shared/components/Button';
import BackButton from '../shared/components/BackButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
export default function Signup() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Location 1', value: 'apple'},
    {label: 'Location 2', value: 'banana'},
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        scrollEnabled={true}
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
            <View style={styles.registerFormContainer}>
              <Text style={styles.registerFormHeading}>Register</Text>
              <View style={styles.nameInputContainer}>
                <TextInput
                  style={[styles.nameInput, {marginLeft: '10%'}]}
                  placeholder="First Name"
                />
                <TextInput
                  placeholder="Last Name"
                  style={[styles.nameInput, {marginRight: '10%'}]}
                />
              </View>

              <TextInput
                placeholder="Enter Mobile Number"
                style={styles.input}
              />
              <TextInput
                placeholder="Enter you email"
                style={styles.input}
                autoCapitalize={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry={true}
                autoCapitalize={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                secureTextEntry={true}
                autoCapitalize={false}
              />

              <Button
                btnTitle={'Sign Up'}
                screenName={'VerifyOtp'}
                btnStyle={styles.registerBtn}
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
  registerFormContainer: {
    flex: 4,
    justifyContent: 'center',
  },
  registerFormHeading: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FF8C00',
    textAlign: 'center',
    marginBottom: 2,
  },
  logoName: {
    color: '#FA8C00',
    fontSize: 24,
    padding: 5,
  },
  input: {
    width: '76%',
    marginTop: '3%',
    marginHorizontal: '12%',
    borderWidth: 0.5,
    borderColor: '#FA8C00',
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    padding: 10,
  },
  registerBtn: {
    marginTop: '5%',
  },
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  nameInput: {
    width: '36%',
    borderWidth: 0.5,
    borderColor: '#FA8C00',
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    padding: 10,
  },
});
