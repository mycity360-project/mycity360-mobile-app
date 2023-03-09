import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {button} from '../constants/style';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

/**
 *
 * @param {String} ButtonType
 * @param {Object} Properties
 * @returns {ButtonComponent}
 */

export default function BackButton() {
  /**
   * TODO: Different type of button PrimaryButton and Non-primary button
   * TODO: Click event or navigation event
   * TODO: disabled button
   * TODO: Button with custom color
   *
   */

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.btn}
        onPress={() => navigation.goBack()}
        hitSlop={{bottom: 5, left: 5, right: 5, top: 5}}>
        <MaterialIcon name="arrow-back" size={23} color={'#FFF'} />
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
    borderRadius: 12,
    padding: 10,
    width: '14%',
  },
});
