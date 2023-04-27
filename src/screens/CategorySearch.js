import {
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Text,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {http} from '../shared/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CategorySearch({navigation, route}) {
  const [isLoading, setIsLoading] = useState(false);
  const [adsData, setAdsData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const {categoryID, areaID} = route.params;
  const [flatlistLoading, setFlatlistLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showNoAdsFoundMsg, setShowNoAdsFoundMsg] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // Clear the state on coming back after navigating
      console.log('32');
      setPage(1);
      setAdsData([]);
      getUserAds();
    });
    // Return the unsubscribe function to avoid memory leaks
    return unsubscribe;
  }, [navigation]);

  const renderFooter = () => {
    if (showNoAdsFoundMsg) {
      return (
        <Text style={{fontSize: 14, color: '#222', textAlign: 'center'}}>
          No Ads Found
        </Text>
      );
    }
    if (!showNoAdsFoundMsg && !hasMore) {
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
  const handleLoadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    (async () => {
      setFlatlistLoading(true);
      await getUserAds();
      setFlatlistLoading(false);
    })();
  }, [page]);

  const getUserAds = async () => {
    try {
      console.log('get ads', adsData, '64');
      const token = await AsyncStorage.getItem('token');
      let url = `/user-ad/?is_active=True&area_id=${areaID}&page=${page}`;
      if (categoryID !== '' && categoryID !== undefined) {
        url = url.concat(`&category_id=${categoryID}`);
      }

      console.log(url, 'Line 66');
      const adsRespData = await http.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHasMore(page <= Math.ceil(adsRespData.count) / pageSize);
      setShowNoAdsFoundMsg(Math.ceil(adsRespData.count) ? false : true);

      const ads = adsRespData?.results?.map((ad, index) => {
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
          key: `${adsData.length + index}`,
        };
      });

      console.log(ads, '94');
      setAdsData([...adsData, ...ads]);
      // console.log(adsData, '100');
    } catch (err) {
      console.log('102 eror CategorySearch');
      Alert.alert(
        'ERROR',
        'Something went wrong, Unable to Fetch Ads CategorySearch',
        [
          {
            text: 'OK',
          },
        ],
      );
    }
  };

  const CARD_HEIGHT = 100;
  const getAdsCardLayout = (_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });

  const renderAds = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: CARD_HEIGHT,
          borderBottomColor: '#999',
          borderWidth: 0.3,
          borderRadius: 5,
          alignItems: 'center',
          marginBottom: 10,
          marginHorizontal: '2%',
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
          style={{
            width: '30%',
            height: '90%',
            backgroundColor: '#999',
            marginHorizontal: 5,
          }}>
          <Image
            source={{uri: item.images[0].image}}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
          />
        </View>

        <View style={{width: '70%', height: '90%', paddingLeft: 5}}>
          <Text style={{fontSize: 16, color: '#111', fontWeight: 500}}>
            {item.title}
          </Text>
          <Text style={{fontSize: 16, color: '#111'}}>₹ {item.price}</Text>
          <Text style={{fontSize: 16, color: '#111'}}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <MaterialIcon name="arrow-back" size={26} color={'#444'} />
          </TouchableOpacity>
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
            onPress={() => {
              navigation.navigate('TextSearch', {
                categoryID: categoryID,
                areaID: areaID,
                text: searchText,
              });
            }}>
            <MaterialIcon name="search" size={26} color={'#FFF'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.adsSection}>
        <FlatList
          data={adsData}
          renderItem={renderAds}
          getItemLayout={getAdsCardLayout}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
          onEndReached={!flatlistLoading && hasMore ? handleLoadMore : null}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    width: '85%',
    borderColor: '#FA8C00',
    backgroundColor: '#EFEFEF',
    height: '70%',
    elevation: 5, //Android Only
    shadowRadius: 5, // IOS Only,
    borderRadius: 10,
  },
  backBtn: {
    width: '15%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    width: '70%',
  },

  searchBtn: {
    width: '15%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FA8C00',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  adsSection: {flex: 10, marginTop: '2%'},
});
