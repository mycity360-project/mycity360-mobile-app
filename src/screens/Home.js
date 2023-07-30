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
  TextInput,
  Dimensions,
} from 'react-native';
import {React, useEffect, useState, useRef, memo, useContext} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import {useIsFocused} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
// import CustomCarousel from 'carousel-with-pagination-rn';
// import Carousel from 'react-native-snap-carousel';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

const {width, height} = Dimensions.get('window');
const screenHeight = height;
export default function Home({navigation}) {
  const [categoriesData, setCategoriesData] = useState([]);
  const [isCategoryLoding, setIsCategoryLoding] = useState(false);
  const [flatlistLoading, setFlatlistLoading] = useState(false);
  const [userAdsData, setUserAdsData] = useState([]);
  const [pageSize] = useState(10);
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();
  const wasFocused = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const {userInfo, logout} = useContext(AuthContext);
  const [showNoAdsFoundMsg, setShowNoAdsFoundMsg] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const carouselRef = useRef(null);

  const getBannerImages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const bannerRespData = await http.get(
        `banner/user/?is_active=True&area_id=${userInfo.localUserArea.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const images = bannerRespData?.results?.map(img => ({
        key: img.id.toString(),
        image: img.image,
        redirectUrl: img.redirect_url,
      }));
      setBannerImages(images);
      setShowBanner(images.length ? true : false);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      } else {
        Alert.alert(
          'ERROR',
          'Something went wrong, Unable to Fetch banner images',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    }
  };

  const handleWebLink = uri => {
    if (uri) {
      navigation.navigate('WebViewScreen', {
        uri,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      carouselRef.current?.showNextItem();
    }, 10000); // 1000 milliseconds = 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setPage(1);
      setUserAdsData(() => []);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setSearchText('');
    if (isFocused && !wasFocused.current) {
      getUserAds();
      getBannerImages();
    }
    wasFocused.current = isFocused;
  }, [isFocused]);

  const getCategories = async () => {
    try {
      setIsCategoryLoding(true);
      const token = await AsyncStorage.getItem('token');
      const categoriesRespData = await http.get(
        'category/user/?page_size=100',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const categories = categoriesRespData.results.map(category => ({
        id: category.id.toString(),
        name: category.name,
        icon: category.icon,
        seq: category.sequence,
        isPrice: category.is_price,
      }));

      setCategoriesData(categories);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      } else {
        Alert.alert(
          'ERROR',
          'Something went wrong, Unable to Fetch Categories',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    } finally {
      setIsCategoryLoding(false);
    }
  };

  useEffect(() => {
    getCategories();
    getBannerImages();
  }, []);

  const renderFooter = () => {
    if (flatlistLoading) {
      return (
        <View style={{marginTop: 10}}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    }

    if (showNoAdsFoundMsg) {
      return (
        <Text
          allowFontScaling={false}
          style={{fontSize: 14, color: '#222', textAlign: 'center'}}>
          No Ads Found
        </Text>
      );
    } else {
      if (!hasMore) {
        return (
          <Text
            allowFontScaling={false}
            style={{fontSize: 14, color: '#222', textAlign: 'center'}}>
            No More Ads to Show
          </Text>
        );
      } else {
        return null;
      }
    }
  };

  const getUserAds = async () => {
    try {
      setFlatlistLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userAdsRespData = await http.get(
        `/user-ad/?is_active=True&page=${page}&area_id=${userInfo.localUserArea.id}&is_home=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setHasMore(page <= Math.ceil(userAdsRespData.count) / pageSize);
      setShowNoAdsFoundMsg(Math.ceil(userAdsRespData.count) ? false : true);
      const ads = userAdsRespData?.results?.map((ad, index) => {
        return {
          id: ad.id,
          code: ad.code,
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
          isPrice: ad.category?.is_price,

          key: `${userAdsData.length + index}`,
        };
      });
      console.log(userAdsRespData);
      setUserAdsData(prevData => [...prevData, ...ads]);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      } else {
        Alert.alert('ERROR', 'Something went wrong, Unable to Fetch Ads Home', [
          {
            text: 'OK',
          },
        ]);
      }
    } finally {
      setFlatlistLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(page + 1);
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

  const CARD_HEIGHT = 175;
  const numColumns = 2;
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
        navigation.navigate('CategorySearch', {
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
          resizeMode="contain"
          source={{
            uri: item.icon,
            width: 60,
            height: 60,
          }}
        />
      </View>

      <View style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          allowFontScaling={false}
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
        <Text
          allowFontScaling={false}
          style={{color: '#222', fontSize: 12, fontWeight: 500}}>
          FEATURED
        </Text>
      </View>
    );
  };

  const formatData = (ads, num) => {
    const numberOfFullRows = Math.floor(ads.length / num);
    let numberOfItemsLastRow = ads.length - numberOfFullRows * num;
    while (numberOfItemsLastRow !== num && numberOfItemsLastRow !== 0) {
      ads.push({key: `blank-${numberOfItemsLastRow}`, empty: true});
      numberOfItemsLastRow++;
    }
    return ads;
  };

  const Item = memo(({item, index}) => {
    return (
      <View style={styles.featuredAdsSection}>
        {item.empty || (
          <Pressable
            style={{
              height: CARD_HEIGHT,
              padding: '2%',
              width: '96%',
              marginBottom: '1%',
              borderWidth: 2,
              borderColor: '#CCC',
              borderRadius: 5,
              alignSelf: 'center',
              ...((index + 1) % 2 === 0
                ? {marginRight: '1.5%'}
                : {marginLeft: '1.5%'}),
            }}
            onPress={() =>
              navigation.navigate('AdDescription', {
                adDetails: {
                  id: item.id,
                  code: item.code,
                  title: item.title,
                  price: item.price,
                  description: item.description,
                  location: item.locationName,
                  area: item.areaName,
                  createdOn: item.createdOn,
                  images: item.images,
                  userID: item.userID,
                  phone: item.phone,
                  categoryID: item.subCategoryID,
                  isPrice: item.isPrice,
                  showCallNowBtn: true,
                  showDeleteBtn: false,
                },
              })
            }>
            <View
              pointerEvents="box-only"
              style={{
                flex: 1.9,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{uri: item.images[0].image}}
                style={{height: '90%', width: '80%'}}
                resizeMode="contain"
              />

              {item.isFeatured && featuredTag()}
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={{fontSize: 14, width: '90%', color: '#000'}}>
                {item.title}
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{flex: 1}}>
                  {item.isPrice && (
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#111',
                      }}>
                      ₹ {item.price}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <MaterialIcon name="location-pin" size={16} color={'#666'} />
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      textAlign: 'left',
                      fontWeight: 500,
                      color: '#666',
                    }}>
                    {item.locationName === item.areaName
                      ? item.locationName
                      : `${item.areaName},\n${item.locationName}`}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      </View>
    );
  });

  const renderHeader = () => {
    return (
      <View style={{flex: 1, marginTop: '2%'}}>
        <View
          style={[
            styles.categoryAndSellBtnSection,
            {height: screenHeight * 0.14},
          ]}>
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
                allowFontScaling={false}
                style={{fontSize: 16, color: '#111', marginBottom: '-10%'}}>
                Sell /
              </Text>
              <Text
                allowFontScaling={false}
                style={{fontSize: 16, color: '#111'}}>
                Post Ad
              </Text>
            </View>
          </TouchableOpacity>
          {/* Category Horizontal List */}
          {isCategoryLoding ? (
            <View
              style={[
                styles.categoryListSection,
                {justifyContent: 'center', alignItems: 'center'},
              ]}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          ) : (
            <View style={styles.categoryListSection}>
              <FlatList
                horizontal={true}
                data={categoriesData}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={true}
                getItemLayout={getItemLayout}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
              />
            </View>
          )}
        </View>
        {showBanner && (
          <View style={[styles.bannerSection, {height: screenHeight * 0.33}]}>
            <SwiperFlatList
              autoplay
              autoplayDelay={5}
              autoplayLoop
              showPagination={true}
              paginationActiveColor={'#FA8C00'}
              data={bannerImages}
              renderItem={({item, index}) => {
                return (
                  <View style={{flex: 1}}>
                    <Pressable onPress={() => handleWebLink(item.redirectUrl)}>
                      <Image
                        source={{uri: item?.image}}
                        resizeMode="cover"
                        style={styles.wrapper}
                      />
                    </Pressable>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            {/* <View style={styles.locationSection}>
              <Text
                allowFontScaling={false}
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
                <MaterialIcon name="location-pin" color={'#222'} size={15} />
                <Text
                  allowFontScaling={false}
                  style={{
                    color: '#222',
                    fontWeight: 500,
                    textDecorationLine: 'underline',
                  }}>
                  {userInfo.localUserArea.name}
                </Text>
              </TouchableOpacity>
            </View> */}
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
                <Text
                  allowFontScaling={false}
                  style={{fontSize: 20, color: '#111'}}>
                  Ads
                </Text>
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
                <Text
                  allowFontScaling={false}
                  style={{fontSize: 20, color: '#111'}}>
                  Services
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchBarSection}>
              <View style={{flex: 0.85, flexDirection: 'row'}}>
                <TextInput
                  allowFontScaling={false}
                  returnKeyType="search"
                  placeholder="Find Mobile, Cars ....."
                  placeholderTextColor={'#222'}
                  style={styles.inputBox}
                  value={searchText}
                  onChangeText={search => {
                    setSearchText(search);
                  }}
                />
                <TouchableOpacity
                  style={styles.searchBtn}
                  onPress={() =>
                    navigation.navigate('TextSearch', {
                      areaID: userInfo.localUserArea.id,
                      text: searchText,
                    })
                  }>
                  <MaterialIcon name="search" size={26} color={'#FFF'} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 0.15,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Location')}>
                  <MaterialIcon
                    name="location-pin"
                    color={'#222'}
                    size={24}
                    style={{alignSelf: 'center'}}
                  />
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: '#222',
                      fontWeight: 500,
                      textDecorationLine: 'underline',
                      fontSize: 12,
                    }}>
                    {userInfo.localUserArea.name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{flex: 6}}>
            <FlatList
              data={formatData(userAdsData, numColumns)}
              ListHeaderComponentStyle={{
                flex: 1,
                backgroundColor: '#FFF',
              }}
              renderItem={({item, index}) => <Item item={item} index={index} />}
              getItemLayout={getAdCardLayout}
              ListHeaderComponent={renderHeader}
              numColumns={numColumns}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              initialNumToRender={8}
              maxToRenderPerBatch={8}
              showsVerticalScrollIndicator={false}
              onEndReached={!flatlistLoading && hasMore ? handleLoadMore : null}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
              ListFooterComponentStyle={{backgroundColor: '#FFF'}}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  innerContainer: {
    flex: 1,
  },
  header: {
    flex: 1.1,
    backgroundColor: '#FFF',
    padding: '1%',
  },
  locationSection: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '1%',
  },
  btnSection: {
    flex: 1.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  searchBarSection: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: '2%',
  },
  inputBox: {
    width: '80%',
    height: '100%',
    color: '#111',
    padding: 5,
    borderColor: '#FA8C00',
    borderWidth: 1,
    borderRadius: 11,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  searchBtn: {
    width: '20%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FA8C00',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  categoryAndSellBtnSection: {
    flexDirection: 'row',
    gap: 5,
    borderColor: '#999',
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
  },
  sellBtn: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '-2%',
    borderColor: '#999',
    borderRightWidth: 0.3,
    padding: 5,
  },
  categoryListSection: {
    flex: 0.9,
  },

  bannerSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredAdsSection: {
    paddingTop: 4,
    width: '50%',
    backgroundColor: '#FFF',
  },
  wrapper: {width: width, height: '100%'},
});
