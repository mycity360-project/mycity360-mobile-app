import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import style, {button} from '../constants/style';

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

  const {btnTitle, screenName, style} = props;

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.btn, style]}
        onPress={() => navigation.navigate(`${screenName}`)}
        hitSlop={{bottom: 5, left: 5, right: 5, top: 5}}>
        <Text style={styles.btnTitle}>{btnTitle}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: '#FFF',
    textAlign: 'center',
  },
});
