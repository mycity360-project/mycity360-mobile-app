import {StyleSheet, View, SafeAreaView, TextInput} from 'react-native';
import React from 'react';

export default function AdSearch() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <TextInput
            returnKeyType="search"
            placeholder="Find Mobile, Cars ....."
            style={styles.searchInput}
          />
        </View>
      </View>
      <View style={styles.body} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {flex: 1},
  searchBar: {flexDirection: 'row', justifyContent: 'center', marginTop: '2%'},
  searchInput: {
    padding: '3%',
    width: '85%',
    backgroundColor: '#EFEFEF',
    height: '85%',
    borderRadius: 20,
    elevation: 5, //Android Only
    shadowRadius: 5, // IOS Only
  },
  body: {flex: 10},
});
