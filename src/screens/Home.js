/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {React, useEffect, useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
export default function Home({navigation}) {
  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  // console.log(categoriesData);
  const [userInfo, setUserInfo] = useState([]);

  const getUserInfo = async () => {
    const info = await AsyncStorage.getItem('userInfo');
    setUserInfo(info);
    const location = JSON.parse(info)?.area?.name;
    console.log(location);
    setSelectedLocation(location);
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  const getCategories = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const categoriesRespData = await http.get('category/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(categoriesRespData.results);
      const categories = categoriesRespData.results.map(category => ({
        id: category.id.toString(),
        name: category.name,
        icon: category.icon,
      }));
      setCategoriesData(categories);
      setIsLoading(false);
    } catch (err) {
      console.log(
        'Something went wrong while fetching categories',
        JSON.stringify(err),
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const [userAdsData, setUserAdsData] = useState([]);
  const getUserAds = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userAdsRespData = await http.get('/user-ad/?is_active=True', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // const respData = JSON.parse(userAdsRespData.results);
      console.log(userAdsRespData.results[0], '77');
      const ads = userAdsRespData.results.map(ad => ({
        id: ad.id.toString(),
        title: ad.name,
        createdOn: ad.created_date,
        description: ad.description,
        images: ad.images,
        isFeatured: ad.is_featured,
        price: ad.price,
        userID: ad.user?.id,
      }));

      setUserAdsData(ads);
      setIsLoading(false);
    } catch (err) {
      console.log(
        'Something went wrong while fetching user ads 80 Home',
        JSON.stringify(err),
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserAds();
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

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.category,
        {
          width: ITEM_WIDTH,
          flex: 1,
        },
      ]}
      onPress={() =>
        navigation.navigate('AdSearch', {
          categoryID: item.id,
        })
      }>
      <View style={{flex: 1.2, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={{
            uri: item.icon,
            width: 45,
            height: 45,
          }}
        />
      </View>

      <View style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 16,
            color: '#111',
          }}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
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

  const renderAds = ({item}) => (
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
          adDetails: {
            id: item.id,
            title: item.name,
            price: item.price,
            description: item.description,
            location: item.location,
            createdOn: item.createdOn,
            images: item.images,
            userID: item.userID,
            phone: item.phone,
          },
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
          source={{uri: item.images[0].image}}
          style={{height: '90%', width: '80%', resizeMode: 'contain'}}
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
  );

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <View style={styles.locationSection}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  padding: '1%',
                  justifyContent: 'flex-end',
                }}
                onPress={() => navigation.navigate('LocationModal')}>
                <MaterialIcon name="location-pin" color={'#222'} size={20} />
                <Text
                  style={{
                    color: '#222',
                    fontWeight: 500,
                  }}>
                  {selectedLocation}
                </Text>
              </TouchableOpacity>
            </View>
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
              onPress={() => {
                navigation.navigate('WhatAreYouOffering', {
                  categoriesData: categoriesData,
                });
              }}>
              <View
                style={{
                  flex: 1.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcon
                  name="add-circle-outline"
                  color={'#FF8C00'}
                  size={40}
                />
              </View>

              <View
                style={{
                  flex: 0.8,
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
              data={userAdsData}
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
    flex: 1,
  },

  locationSection: {flex: 0.5},
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
    flex: 0.5,
    flexDirection: 'row',
    padding: 5,
    gap: 5,
  },
  sellBtn: {
    paddingLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '-4%',
  },
  category: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImg: {width: 35, height: 35},
  featuredAdsSection: {flex: 4, padding: '1%'},
});
