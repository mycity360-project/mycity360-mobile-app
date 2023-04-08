/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import useNavigation from '@react-navigation/native';

export default function SubCategory({navigation: {goBack}, navigation}) {
  const data = [
    {
      name: 'Mobile Phones',
      onPress: () => navigation.navigate('IncludeSomeDetails'),
    },
    {
      name: 'Accessories',
      //onPress: () => navigation.navigate('includeSomeDetails'),
    },
    {
      name: 'Tablets',
      //onPress: () => navigation.navigate('includeSomeDetails'),
    },
  ];

  const CARD_HEIGHT = 50;
  const getSubCategoryCardLayout = (_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });

  const renderSubCategory = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          height: CARD_HEIGHT,
          borderBottomColor: '#999',
          borderBottomWidth: 0.5,
          justifyContent: 'center',
        }}
        onPress={item.onPress}>
        <Text style={{fontSize: 16, color: '#222', marginLeft: 10}}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}>
          <MaterialIcon name="arrow-back" color={'#333'} size={28} />
        </TouchableOpacity>

        <Text style={styles.headingText}>Mobiles</Text>
      </View>
      <View style={styles.subCategorySection}>
        <FlatList
          data={data}
          renderItem={renderSubCategory}
          getItemLayout={getSubCategoryCardLayout}
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
    flex: 0.5,
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 15,
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    gap: 20,
  },
  headingText: {fontSize: 18, color: '#111'},
  subCategorySection: {flex: 8},
});
