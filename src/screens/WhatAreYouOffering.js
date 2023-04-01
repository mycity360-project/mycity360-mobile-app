import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import React, {useCallback} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {StackActions, useNavigation} from '@react-navigation/native';

export default function WhatAreYouOffering({navgation}) {
  const navigation = useNavigation();
  const closeSellScreen = StackActions.pop(1);

  const data = [
    {key: '1', name: 'Cars', icon: 'car-repair', bgcolor: '#999'},
    {key: '2', name: 'Properties', icon: 'house', bgcolor: '#888'},
    {
      key: '3',
      name: 'Mobiles',
      icon: 'phone-android',
      bgcolor: '#777',
      onPress: () => navigation.navigate('SubCategory'),
    },
    {key: '4', name: 'Jobs', icon: 'work-outline', bgcolor: '#666'},
    {key: '5', name: 'Bikes', icon: 'two-wheeler', bgcolor: '#555'},
    {
      key: '6',
      name: 'Electronics & Appliances',
      icon: 'live-tv',
      bgcolor: '#777',
    },
    {
      key: '7',
      name: 'Commercial Vehicles & Spares',
      icon: 'miscellaneous-services',
      bgcolor: '#888',
    },
    {key: '8', name: 'More Categories', icon: 'view-headline', bgcolor: '#999'},
  ];

  const CARD_HEIGHT = 100;
  const getCategoryCardLayout = (_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });

  const renderItem = useCallback(
    ({item}) => (
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
        onPress={item.onPress}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <MaterialIcon name={item.icon} size={35} color={'#000'} />
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
    ),
    [],
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
          data={data}
          renderItem={renderItem}
          getItemLayout={getCategoryCardLayout}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
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
