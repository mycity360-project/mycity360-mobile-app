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
import React, {useEffect, useState, useContext} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {http} from '../shared/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';

export default function TextSearch({navigation, route}) {
  const [isLoading, setIsLoading] = useState(false);
  const [adsData, setAdsData] = useState([]);
  const [searchText, setSearchText] = useState(route.params?.text || '');
  const {categoryID, areaID} = route.params;
  const [flatlistLoading, setFlatlistLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showNoAdsFoundMsg, setShowNoAdsFoundMsg] = useState(false);
  const {logout} = useContext(AuthContext);

  const renderFooter = () => {
    if (showNoAdsFoundMsg) {
      return (
        <Text
          allowFontScaling={false}
          style={{fontSize: 14, color: '#222', textAlign: 'center'}}>
          No Ads Found
        </Text>
      );
    }
    if (!showNoAdsFoundMsg && !hasMore) {
      return (
        <Text
          allowFontScaling={false}
          style={{fontSize: 14, color: '#222', textAlign: 'center'}}>
          No More Ads to Show
        </Text>
      );
    }

    if (flatlistLoading) {
      return (
        <View style={{marginTop: 10}}>
          <ActivityIndicator size="small" color={'#FA8C00'} />
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

  const searchBtnHandler = async () => {
    try {
      setFlatlistLoading(true);
      await getUserAds();
      setFlatlistLoading(false);
    } catch (error) {}
  };

  const getUserAds = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      let url = `/user-ad/?is_active=True&area_id=${areaID}&page=${page}`;
      if (categoryID !== '' && categoryID !== undefined) {
        url = url.concat(`&category_id=${categoryID}`);
      }
      if (searchText !== '') {
        url = url.concat(`&search=${searchText}`);
      }
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
          phone: ad.phone,
          key: `${adsData.length + index}`,
        };
      });
      if (page === 1) {
        setAdsData(ads);
      } else {
        setAdsData([...adsData, ...ads]);
      }
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      } else {
        Alert.alert(
          'ERROR',
          'Something went wrong, Unable to Fetch Ads TextSearch',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
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
              code: item.code,
              isPrice: item.isPrice,
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
          <Text
            allowFontScaling={false}
            style={{fontSize: 16, color: '#111', fontWeight: 500}}>
            {item.title}
          </Text>
          {item.isPrice && (
            <Text
              allowFontScaling={false}
              style={{fontSize: 16, fontWeight: 500, color: '#111'}}>
              ₹ {item.price}
            </Text>
          )}
          <Text allowFontScaling={false} style={{fontSize: 14, color: '#111'}}>
            Ad ID : {item.code}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={'#FA8C00'} />
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
            allowFontScaling={false}
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
            onPress={async () => await searchBtnHandler()}>
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
    color: '#111',
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
