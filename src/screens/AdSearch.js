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

export default function AdSearch({navigation, route}) {
  const [isLoading, setIsLoading] = useState(false);
  const [adsData, setAdsData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const {categoryID, areaID} = route.params;
  const [flatlistLoading, setFlatlistLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isChangeText, setIsChangeText] = useState(false);

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
  const handleLoadMore = () => {
    if (!flatlistLoading && hasMore) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    (async () => {
      setFlatlistLoading(true);
      await getUserAds();
      setFlatlistLoading(false);
    })();
  }, [page, isChangeText]);

  const getUserAds = async () => {
    try {
      console.log('get ads', adsData, '64');
      const token = await AsyncStorage.getItem('token');
      let url = `/user-ad/?is_active=True&area_id=${areaID}&page=${page}`;
      if (categoryID !== '' && categoryID !== undefined) {
        url = url.concat(`&category_id=${categoryID}`);
      }
      if (searchText !== '') {
        url = url.concat(`&search=${searchText}`);
      }

      console.log(url, 'Line 66');
      const adsRespData = await http.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHasMore(page <= Math.ceil(adsRespData.count) / pageSize);

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

      console.log(ads, '97');

      setAdsData([...adsData, ...ads]);
      // console.log(adsData, '101');
    } catch (err) {
      console.log('53 eror adsearch');
      Alert.alert(
        'ERROR',
        'Something went wrong, Unable to Fetch Ads AdSearch',
        [
          {
            text: 'OK',
          },
        ],
      );
    }
  };

  const searchHandler = async () => {
    setAdsData([]);
    setPage(1);
    setIsChangeText(true);
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
              setIsChangeText(false);
              setSearchText(search);
            }}
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={async () => await searchHandler()}>
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
          onEndReached={handleLoadMore}
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
