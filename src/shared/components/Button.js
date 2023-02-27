import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {button} from '../constants/style';

/**
 *
 * @param {String} ButtonType
 * @param {Object} Properties
 * @returns {ButtonComponent}
 */

export default function Button(props) {
  /**
   * TODO: Different type of button PrimaryButton and Non-primary button
   * TODO: Click event or navigation event
   * TODO: disabled button
   * TODO: Button with custom color
   *
   */

  const {btnTitle, screenName} = props;

  const navigation = useNavigation();
  return (
    <View style={style.container}>
      <Pressable
        style={style.btn}
        onPress={() => navigation.navigate(`${screenName}`)}
        hitSlop={{bottom: 5, left: 5, right: 5, top: 5}}>
        <Text style={style.btnTitle}>{btnTitle}</Text>
      </Pressable>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 10,
  },
  btn: {
    backgroundColor: button.buttonColor,
    borderRadius: 15,
    padding: 10,
    width: '50%',
    marginHorizontal: '25%',
  },
  btnTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
