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
  const [autoFocus, setAutoFocus] = useState(true);
  const [searchText, setSearchText] = useState('');
  const {categoryID, areaID} = route.params;
  console.log(categoryID, areaID, '19');

  const getUserAds = async () => {
    try {
      // console.log(searchText, '20');
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      let url = `/user-ad/?is_active=True&area_id=${areaID}`;
      if (categoryID !== '' && categoryID !== undefined) {
        url = url.concat(`&category_id=${categoryID}`);
      }
      if (searchText !== '') {
        url = url.concat(`&search=${searchText}`);
      }
      console.log(url, '38');
      const adsRespData = await http.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ads = adsRespData?.results?.map(ad => ({
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
      }));

      console.log(ads, '59');
      setAdsData(ads);
      setIsLoading(false);
      console.log('51');
    } catch (err) {
      console.log('53 eror adsearch');
      setIsLoading(false);
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
  useEffect(() => {
    getUserAds();
  }, []);

  const searchHandler = () => {
    getUserAds();
    setAutoFocus(false);
  };
  const CARD_HEIGHT = 120;
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
            autoFocus={autoFocus}
            value={searchText}
            onChangeText={search => setSearchText(search)}
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => searchHandler()}>
            <MaterialIcon name="search" size={26} color={'#FFF'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.adsSection}>
        <FlatList
          data={adsData}
          renderItem={renderAds}
          getItemLayout={getAdsCardLayout}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
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
