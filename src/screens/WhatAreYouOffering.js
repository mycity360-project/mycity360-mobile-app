/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {StackActions} from '@react-navigation/native';

export default function WhatAreYouOffering({navigation, route}) {
  const {categoriesData} = route.params;
  const closeSellScreen = StackActions.pop(1); // close screen on press of close btn

  const CARD_HEIGHT = 100;
  const getCategoryCardLayout = (_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.category,
        {
          height: CARD_HEIGHT,
          width: '49%',
          padding: 15,
          borderRightWidth: 0.5,
          borderRightColor: '#999',
          borderBottomWidth: 0.5,
          borderBottomColor: '#999',
          // backgroundColor: item.bgcolor,
        },
      ]}
      onPress={() =>
        navigation.navigate('SubCategory', {
          categoryID: item.id,
          categoryName: item.name,
        })
      }>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={{
            uri: item.icon,
            width: 45,
            height: 45,
          }}
        />
        <Text
          style={{
            fontSize: 12,
            color: '#111',
            marginTop: 4,
          }}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(closeSellScreen);
          }}>
          <MaterialIcon name="close" color={'#444'} size={32} />
        </TouchableOpacity>

        <Text style={styles.headingText}>What Are You Offering ?</Text>
      </View>
      <View style={styles.categoryListSection}>
        {/* Render catrgory cards */}
        <FlatList
          data={categoriesData}
          renderItem={renderItem}
          getItemLayout={getCategoryCardLayout}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 0.6,
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 15,
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    gap: 20,
  },
  headingText: {fontSize: 18, color: '#111'},
  categoryListSection: {flex: 10, padding: 10},
});
