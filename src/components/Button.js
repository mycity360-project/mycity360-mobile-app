import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export default function Button({btnTitle, screenName, btnStyle, btnTextStyle}) {
  const navigation = useNavigation();
  return (
    <View>
      <Pressable
        style={btnStyle}
        onPress={() => navigation.navigate(`${screenName}`)}
        hitSlop={{bottom: 5, left: 5, right: 5, top: 5}}>
        <Text style={btnTextStyle}>{btnTitle}</Text>
      </Pressable>
    </View>
  );
}
