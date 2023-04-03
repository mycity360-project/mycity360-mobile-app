import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {React, useCallback, useContext, useEffect, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import CustomButton from '../shared/components/CustomButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
export default function Home({navigation}) {
  const {logout} = useContext(AuthContext);
  const [categoriesData, setCategoriesData] = useState([]);

  let adData = [
    {
      key: '1',
      title:
        'Mobile for resale , used only for 6 months in warranty and in good condition',
      price: '8000',
      location: 'Nipania, Indore',
      image: require('../assets/images/mobile.png'),
      bgcolor: '#979',
      isFeatured: true,
    },
    {
      key: '2',
      title: 'Mobile for resale',
      price: '8000',
      location: 'Nipania, Indore',
      image: require('../assets/images/mobile.png'),
      bgcolor: '#989',
    },
    {
      key: '3',
      title: 'Mobile for resale',
      price: '8000',
      location: 'Nipania, Indore',
      image: require('../assets/images/mobile.png'),
      bgcolor: '#888',
    },
    {
      key: '4',
      title: 'Mobile for resale',
      price: '8000',
      location: 'Nipania, Indore',
      image: require('../assets/images/mobile.png'),
      bgcolor: '#777',
      isFeatured: true,
    },
    {
      key: '5',
      title: 'Mobile for resale',
      price: '8000',
      location: 'Nipania, Indore',
      image: require('../assets/images/mobile.png'),
      bgcolor: '#666',
    },
    {
      key: '6',
      title: 'Mobile for resale',
      price: '8000',
      location: 'Nipania, Indore',
      image: require('../assets/images/mobile.png'),
      bgcolor: '#666',
    },
    {
      key: '7',
      title: 'Mobile for resale ',
      price: 8000,
      location: 'Nipania, Indore',
      image: require('../assets/images/mobile.png'),
      bgcolor: '#666',
    },
  ];

  const getCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const categoriesRespData = await http.get(`category/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(categoriesRespData.results);
      const categories = categoriesRespData.results.map(category => ({
        key: category.id.toString(),
        title: category.name,
        icon: category.icon,
      }));
      setCategoriesData(categories);
    } catch (err) {
      console.log(
        'Something went wrong while fetching categories',
        JSON.stringify(err),
      );
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const ITEM_WIDTH = 80;
  const getItemLayout = (_, index) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  const CARD_HEIGHT = 250;
  const getAdCardLayout = (_, index) => ({
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
            width: ITEM_WIDTH,
            flex: 1,
          },
        ]}
        onPress={item.onpress}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={{
              uri: item.icon,
              width: 50,
              height: 50,
            }}
          />
        </View>

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 16,
              color: '#111',
            }}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  const featuredTag = () => {
    return (
      <View
        style={{
          backgroundColor: '#fba333',
          paddingHorizontal: 10,
          position: 'absolute',
          left: 5,
          top: 5,
          borderRadius: 2,
        }}>
        <Text style={{color: '#222', fontSize: 12, fontWeight: 500}}>
          FEATURED
        </Text>
      </View>
    );
  };

  const renderAds = useCallback(
    ({item}) => (
      <Pressable
        style={{
          // backgroundColor: item.bgcolor,
          height: CARD_HEIGHT,
          padding: '2%',
          width: '49%',
          marginBottom: '1%',
          borderWidth: 2,
          borderColor: '#CCC',
          borderRadius: 5,
        }}
        onPress={() =>
          navigation.navigate('AdDescription', {
            key: item.key,
            title: item.title,
            price: item.price,
            location: item.location,
          })
        }>
        <View
          pointerEvents="box-only"
          style={{
            flex: 1.5,
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: '#664489',
          }}>
          <Image
            source={item.image}
            style={{height: '90%', resizeMode: 'contain'}}
          />
          {item.isFeatured ? featuredTag() : ''}
        </View>
        <View
          style={{
            flex: 1,
            // backgroundColor: '#ccc',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{fontSize: 14, fontWeight: 600, color: '#111'}}>
              ₹ {item.price}
            </Text>
            <Text
              numberOfLines={2}
              style={{fontSize: 14, width: '90%', color: '#000'}}>
              {item.title}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 5}}>
            <MaterialIcon name="location-pin" size={16} color={'#666'} />
            <Text
              style={{
                fontSize: 12,
                textAlign: 'left',
                fontWeight: 500,
                color: '#666',
              }}>
              {item.location}
            </Text>
          </View>
        </View>
      </Pressable>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <View style={styles.btnSection}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={{
                  backgroundColor: '#FF8C00',
                  marginLeft: '5%',
                  width: '40%',
                  height: '80%',
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 20, color: '#111'}}>Ads</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Service')}
                style={{
                  marginRight: '5%',
                  backgroundColor: '#bfbfbf',
                  width: '40%',
                  height: '80%',
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 20, color: '#111'}}>Services</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchBarSection}>
              <TouchableOpacity
                style={styles.searchInput}
                onPress={() => navigation.navigate('AdSearch')}
                activeOpacity={1}>
                <MaterialIcon name="search" size={28} color={'#222'} />
                <Text>Search here</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.categorySection}>
            {/* Sell Button to add item for sell */}
            <TouchableOpacity
              style={styles.sellBtn}
              onPress={() => navigation.navigate('WhatAreYouOffering')}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcon
                  name="add-circle-outline"
                  color={'#FF8C00'}
                  size={35}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 16, color: '#111'}}>Sell</Text>
              </View>
            </TouchableOpacity>
            {/* Category Horizontal List */}
            <FlatList
              horizontal={true}
              data={categoriesData}
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
              getItemLayout={getItemLayout}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
            />
          </View>

          <View style={styles.featuredAdsSection}>
            <FlatList
              data={adData}
              renderItem={renderAds}
              getItemLayout={getAdCardLayout}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              initialNumToRender={15}
              maxToRenderPerBatch={15}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  innerContainer: {
    flex: 1,
  },
  header: {
    flex: 0.6,
  },
  btnSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBarSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flexDirection: 'row',
    gap: 5,
    width: '85%',
    backgroundColor: '#EFEFEF',
    height: '85%',
    borderRadius: 20,
    padding: 10,
    elevation: 5, //Android Only
    shadowRadius: 5, // IOS Only
  },
  searchIcon: {
    marginRight: '40%',
  },
  categorySection: {
    flex: 0.4,
    flexDirection: 'row',
    padding: 5,
    gap: 5,
  },
  sellBtn: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImg: {width: 35, height: 35},
  featuredAdsSection: {flex: 3, padding: '1%'},
});
