import {
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function AdSearch({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <MaterialIcon name="arrow-back" size={26} color={'#444'} />
          </TouchableOpacity>
          <TextInput
            returnKeyType="search"
            placeholder="Find Mobile, Cars ....."
            style={styles.inputBox}
          />
          <TouchableOpacity style={styles.searchBtn}>
            <MaterialIcon name="search" size={26} color={'#FFF'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    width: '85%',
    borderColor: '#FA8C00',
    backgroundColor: '#EFEFEF',
    height: '70%',
    elevation: 5, //Android Only
    shadowRadius: 5, // IOS Only,
    borderRadius: 10,
  },
  backBtn: {
    width: '15%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    width: '70%',
  },

  searchBtn: {
    width: '15%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FA8C00',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  body: {flex: 10},
});
