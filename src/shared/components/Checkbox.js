import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CheckBox = props => {
  const iconName = props.isChecked
    ? 'checkbox-marked'
    : 'checkbox-blank-outline';
  const [onHover, setOnHover] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={props.onPress}>
        <MaterialCommunityIcons name={iconName} size={24} color="#FF8C00" />
      </Pressable>

      <Text style={styles.title} onPress={props.handleTextClick}>
        {props.title}
      </Text>
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '85%',
    marginTop: 10,
    marginHorizontal: 15,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    fontWeight: 500,
  },
});
