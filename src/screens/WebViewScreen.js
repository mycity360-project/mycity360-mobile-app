import {StyleSheet, View, TouchableOpacity, SafeAreaView} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import {StackActions} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function WebViewScreen({navigation, route}) {
  const closeSellScreen = StackActions.pop(1);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(closeSellScreen);
          }}>
          <MaterialIcon name="close" color={'#FFF'} size={32} />
        </TouchableOpacity>
      </View>
      <View style={styles.WebViewSection}>
        <WebView source={route.params} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FA8C00',
    padding: 5,
    paddingLeft: 15,
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    gap: 20,
  },
  WebViewSection: {flex: 16},
});
