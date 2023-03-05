/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Image, View, TextInput} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import React, {useState} from 'react';
import {Button} from '../shared/components';

export default function Signup() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Location 1', value: 'apple'},
    {label: 'Location 2', value: 'banana'},
  ]);
  return (
    <View style={styles.container}>
      <View style={{flex: 0.5}} />
      <View style={{flex: 1.5, flexDirection: 'row'}}>
        <View style={{flex: 1}} />
        <View style={{flex: 1}}>
          <Image source={require('../assets/images/logo.png')} />
        </View>
        <View style={{flex: 1}} />
      </View>
      <View style={{flex: 4, flexDirection: 'column'}}>
        <View style={{flex: 5, alignItems: 'center'}}>
          <TextInput style={styles.input} placeholder="First Name" />
          <TextInput style={styles.input} placeholder="Last Name" />
          <TextInput style={styles.input} placeholder="Enter you email" />
          <TextInput style={styles.input} placeholder="Enter you password" />
          <TextInput style={styles.input} placeholder="Confirm password" />
          <DropDownPicker
            placeholder="Select a Location"
            style={{
              alignSelf: 'center',
              borderColor: '#FA8C00',
            }}
            containerStyle={{
              width: '70%',
              backgroundColor: '#fff',
            }}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
        </View>
        <View style={{flex: 1}}>
          <Button
            btnTitle={'Sign up'}
            screenName={'VerifyOtp'}
            btnStyle={styles.btn}
            btnTextStyle={styles.btnTitle}
          />
        </View>
      </View>
      <View style={{flex: 0.5}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
  logoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#FA8C00',
    borderRadius: 20,
    paddingVertical: 10,
    width: '75%',
    marginHorizontal: '12%',
  },
  btnTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  input: {
    width: '70%',
    height: '10%',
    borderWidth: 0.5,
    borderColor: '#FA8C00',
    marginBottom: '2%',
    borderRadius: 20,
  },
});
