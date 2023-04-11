import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {button} from '../constants/style';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
/**
 *
 * @param {String} ButtonType
 * @param {Object} Properties
 * @returns {ButtonComponent}
 */

export default function CustomButton(props) {
  /**
   * TODO: Different type of button PrimaryButton and Non-primary button
   * TODO: Click event or navigation event
   * TODO: disabled button
   * TODO: Button with custom color
   *
   */

  const {btnTitle, onpress, style, textStyle, icon, btnType} = props;
  let btnStyle = [styles.btn, style];
  let btnView = (
    <View style={styles.btnTitleSection}>
      <Text style={[styles.btnTitle, textStyle]}>{btnTitle}</Text>
      <MaterialIcon name={icon} size={20} color={'#FFF'} />
    </View>
  );
  if (btnType === 'back') {
    btnStyle = styles.backBtn;
    btnView = <MaterialIcon name="arrow-back" size={23} color={'#FFF'} />;
  }
  if (btnType === 'backAd') {
    btnStyle = style;
    btnView = <MaterialIcon name="arrow-back" size={26} color={'#222'} />;
  }
  return (
    <View style={styles.container}>
      <Pressable
        style={btnStyle}
        onPress={onpress}
        hitSlop={{bottom: 5, left: 5, right: 5, top: 5}}>
        {btnView}
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
    width: '60%',
    alignSelf: 'center',
  },
  backBtn: {
    backgroundColor: button.buttonColor,
    borderRadius: 12,
    padding: 10,
    width: '13%',
  },

  btnTitleSection: {
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
