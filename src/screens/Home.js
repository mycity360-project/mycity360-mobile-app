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
  Linking,
} from 'react-native';
import {React, useEffect, useState, useRef, memo, useContext} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import {useIsFocused} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import WebView from 'react-native-webview';
const {width, height} = Dimensions.get('window');

export default function Home({navigation}) {
  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoding, setIsCategoryLoding] = useState(false);
  const [flatlistLoading, setFlatlistLoading] = useState(false);
  const [userAdsData, setUserAdsData] = useState([]);
  const [pageSize] = useState(10);
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();
  const wasFocused = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const {userInfo} = useContext(AuthContext);
  const [showNoAdsFoundMsg, setShowNoAdsFoundMsg] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [showBanner, setShowBanner] = useState(false);

  const getBannerImages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const bannerRespData = await http.get('banner/user/?is_active=True', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const images = bannerRespData?.results?.map(img => ({
        key: img.id.toString(),
        image: img.image,
        redirectUrl: img.redirect_url,
      }));
      setBannerImages(images);
      setShowBanner(images.length ? true : false);
    } catch (err) {
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
  };

  const handleWebLink = uri => {
    console.log(uri, '72');
    navigation.navigate('WebViewScreen', {
      uri,
    });
  };

  const getBannerLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      if (!isScrolling) {
        const nextIndex = (currentIndex + 1) % bannerImages.length;
        setCurrentIndex(nextIndex);
        flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentIndex, bannerImages, isReady, isScrolling]);

  useEffect(() => {
    if (flatListRef.current && isReady) {
      flatListRef.current.scrollToIndex({index: currentIndex, animated: true});
    }
  }, [currentIndex, isReady]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // Clear the state on coming back after navigating
      setPage(1);
      setUserAdsData([]);
      // setFlatlistLoading(false);
    });
    // Return the unsubscribe function to avoid memory leaks
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setSearchText('');
    if (isFocused && !wasFocused.current) {
      // Reload the screen when it comes into focus
      getUserAds();
    }
    // Update the previous focus state
    wasFocused.current = isFocused;
  }, [isFocused]);

  const getCategories = async () => {
    try {
      setIsCategoryLoding(true);
      const token = await AsyncStorage.getItem('token');
      const categoriesRespData = await http.get('category/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categories = categoriesRespData.results.map(category => ({
        id: category.id.toString(),
        name: category.name,
        icon: category.icon,
        seq: category.sequence,
      }));

      setCategoriesData(categories);
    } catch (err) {
      Alert.alert('ERROR', 'Something went wrong, Unable to Fetch Categories', [
        {
          text: 'OK',
        },
      ]);
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
        <Text style={{fontSize: 14, color: '#222', textAlign: 'center'}}>
          No Ads Found
        </Text>
      );
    } else {
      if (!hasMore) {
        return (
          <Text style={{fontSize: 14, color: '#222', textAlign: 'center'}}>
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
        `/user-ad/?is_active=True&page=${page}&area_id=${userInfo.localUserArea.id}`,
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

      setUserAdsData([...userAdsData, ...ads]);
    } catch (err) {
      Alert.alert('ERROR', 'Something went wrong, Unable to Fetch Ads Home', [
        {
          text: 'OK',
        },
      ]);
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

  const CARD_HEIGHT = 200;
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
                  {userInfo.localUserArea.name}
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
              <TextInput
                returnKeyType="search"
                placeholder="Find Mobile, Cars ....."
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
            <View style={styles.bannerSection}>
              {/* <TouchableOpacity onPress={openLinkHandler}> */}
              <FlatList
                data={bannerImages}
                ref={flatListRef}
                keyExtractor={item => item.key}
                onMomentumScrollBegin={() => setIsScrolling(true)}
                onMomentumScrollEnd={event => {
                  if (isScrolling) {
                    const x = event.nativeEvent.contentOffset.x;
                    let index = Math.round(x / width);
                    const len = bannerImages.length - 1;
                    if (index === len && currentIndex === len) {
                      index = 0;
                      flatListRef.current?.scrollToIndex({index});
                    }
                    setCurrentIndex(index);
                    setIsScrolling(false);
                  }
                }}
                getItemLayout={getBannerLayout}
                onLayout={() => setIsReady(true)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleWebLink(item.redirectUrl)}>
                      <Image
                        source={{uri: item.image}}
                        resizeMode="contain"
                        style={styles.wrapper}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
              <View style={styles.dotWrapper}>
                {bannerImages.map((e, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        styles.dotCommon,
                        parseInt(currentIndex) === index
                          ? styles.dotActive
                          : styles.dotNotActive,
                      ]}
                    />
                  );
                })}
              </View>
              {/* </TouchableOpacity> */}
            </View>
          )}
          <View
            style={[
              styles.featuredAdsSection,
              showBanner ? {flex: 2.8} : {flex: 4},
            ]}>
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
              onEndReached={!flatlistLoading && hasMore ? handleLoadMore : null}
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
    width: '85%',
    marginHorizontal: '7.5%',
    borderColor: '#FA8C00',
    borderWidth: 1,
    borderRadius: 11,
  },
  inputBox: {
    width: '80%',
    height: '100%',
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
    flex: 0.8,
    flexDirection: 'row',
    gap: 5,
    marginTop: '1%',
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
    flex: 0.8,
  },

  category: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerSection: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#999',
    marginTop: '1%',
  },
  wrapper: {width: width, height: '100%'},
  dotWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
  },
  dotCommon: {width: 12, height: 12, borderRadius: 6, marginLeft: 5},
  dotActive: {
    backgroundColor: '#FA8C00',
  },
  dotNotActive: {
    backgroundColor: '#fff',
  },
  featuredAdsSection: {padding: '2%'},
});
