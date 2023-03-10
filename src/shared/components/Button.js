import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import style, {button} from '../constants/style';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

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

  const {btnTitle, screenName, style, icon} = props;

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.btn, style]}
        onPress={() => navigation.navigate(`${screenName}`)}
        hitSlop={{bottom: 5, left: 5, right: 5, top: 5}}>
        <View style={styles.btnTitleContainer}>
          <Text style={styles.btnTitle}>{btnTitle}</Text>
          <MaterialIcon name={icon} size={20} color={'#FFF'} />
        </View>
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
  btnTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  btnTitle: {
    fontSize: 20,
    color: '#FFF',
  },
});
