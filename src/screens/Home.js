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
  Alert,
} from 'react-native';
import {React, useEffect, useState, useRef, memo} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import {useIsFocused} from '@react-navigation/native';

export default function Home({navigation}) {
  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flatlistLoading, setFlatlistLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [userInfo, setUserInfo] = useState([]);
  const [userAdsData, setUserAdsData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();
  const wasFocused = useRef(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Clear the state before navigating
      setPage(1);
      setUserAdsData([]);
    });
    // Return the unsubscribe function to avoid memory leaks
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (isFocused && !wasFocused.current) {
        // Reload the screen when it comes into focus
        await getUserAds();
        console.log('loaded!35 Home');
      }
      // Update the previous focus state
      wasFocused.current = isFocused;
      setIsLoading(false);
    })();
  }, [isFocused]);

  const getUserInfo = async () => {
    try {
      setIsLoading(true);
      const info = await AsyncStorage.getItem('userInfo');
      setUserInfo(JSON.parse(info));
      const location = JSON.parse(info)?.localUserArea?.name;
      setSelectedLocation(location);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('ERROR', 'Something went wrong, we are working on it', [
        {
          text: 'OK',
        },
      ]);
    }
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
        seq: category.sequence,
      }));

      setCategoriesData(categories);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.alert('ERROR', 'Something went wrong, Unable to Fetch Categories', [
        {
          text: 'OK',
        },
      ]);
      // console.log(
      //   'Something went wrong while fetching categories',
      //   JSON.stringify(err),
      // );
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const renderFooter = () => {
    if (!hasMore) {
      return (
        <Text style={{fontSize: 14, color: '#222', textAlign: 'center'}}>
          No More Ads to Show
        </Text>
      );
    }
    if (flatlistLoading) {
      return (
        <View style={{marginTop: 10}}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    } else {
      return null;
    }
  };

  const getUserAds = async () => {
    try {
      console.log(page, '121');
      const token = await AsyncStorage.getItem('token');
      const userAdsRespData = await http.get(
        `/user-ad/?is_active=True&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // const respData = JSON.parse(userAdsRespData.results);
      // console.log(userAdsRespData.count, '115 count');
      setHasMore(page <= Math.ceil(userAdsRespData.count) / pageSize);
      const ads = userAdsRespData?.results?.map((ad, index) => {
        return {
          id: ad.id,
          title: ad.name,
          createdOn: ad.created_date,
          description: ad.description,
          images: ad.images,
          isFeatured: ad.is_featured,
          price: ad.price,
          userID: ad.user?.id,
          subCategoryID: ad.category.id,
          locationName: ad.area?.location?.name,
          areaName: ad.area?.name,
          key: `${userAdsData.length + index}`,
        };
      });
      console.log('152');
      console.log(ads, ads.length, page, '153');

      setUserAdsData([...userAdsData, ...ads]);

      console.log('155');
    } catch (err) {
      setIsLoading(false);
      console.log('157');
      Alert.alert('ERROR', 'Something went wrong, Unable to Fetch Ads Home', [
        {
          text: 'OK',
        },
      ]);
      // console.log(
      //   'Something went wrong while fetching user ads 80 Home',
      //   JSON.stringify(err),
      // );
    }
  };

  const handleLoadMore = () => {
    if (!flatlistLoading && hasMore) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      setFlatlistLoading(true);
      (async () => {
        await getUserAds();
        setFlatlistLoading(false);
      })();
    }
  }, [page]);

  const ITEM_WIDTH = 85;
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
          areaID: userInfo.localUserArea.id,
        })
      }>
      <View
        style={{
          flex: 1.2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{
            uri: item.icon,
            width: 50,
            height: 50,
          }}
        />
      </View>

      <View style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 14,
            color: '#111',
            textAlign: 'center',
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

  const Item = memo(({item}) => {
    return (
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
              location: item.locationName,
              area: item.areaName,
              createdOn: item.createdOn,
              images: item.images,
              userID: item.userID,
              phone: item.phone,
              categoryID: item.subCategoryID,
              showCallNowBtn: true,
              showDeleteBtn: false,
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
            style={{height: '90%', width: '80%'}}
            resizeMode="contain"
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
              {item.locationName === item.areaName
                ? item.locationName
                : `${item.areaName} , ${item.locationName}`}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  });

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
              <Text
                style={{
                  color: '#222',
                  fontWeight: 500,
                }}>
                Hi, {userInfo.first_name}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                }}
                onPress={() => navigation.navigate('Location')}>
                <MaterialIcon name="location-pin" color={'#222'} size={20} />
                <Text
                  style={{
                    color: '#222',
                    fontWeight: 500,
                    textDecorationLine: 'underline',
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
                onPress={() =>
                  navigation.navigate('AdSearch', {
                    areaID: userInfo?.localUserArea?.id,
                  })
                }
                activeOpacity={1}>
                <MaterialIcon name="search" size={24} color={'#222'} />
                <Text>Search here</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.categoryAndSellBtnSection}>
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
                  flex: 1.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcon
                  name="add-circle-outline"
                  color={'#FF8C00'}
                  size={45}
                />
              </View>

              <View
                style={{
                  flex: 0.9,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontSize: 16, color: '#111', marginBottom: '-10%'}}>
                  Sell /
                </Text>
                <Text style={{fontSize: 16, color: '#111'}}>Post Ad</Text>
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
              renderItem={({item}) => <Item item={item} />}
              getItemLayout={getAdCardLayout}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              initialNumToRender={8}
              maxToRenderPerBatch={8}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
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
  locationSection: {
    flex: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
  },
  btnSection: {
    flex: 1.15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBarSection: {
    flex: 1.15,
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
  categoryAndSellBtnSection: {
    flex: 0.8,
    flexDirection: 'row',
    gap: 5,
    marginTop: '1%',
    borderColor: '#999',
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
  },
  sellBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '-2%',
    borderColor: '#999',
    borderRightWidth: 0.3,
    padding: 5,
  },

  category: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredAdsSection: {flex: 4, padding: '2%'},
});
