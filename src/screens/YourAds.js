import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';

export default function YourAds({navigation, route}) {
  const [yourAdsData, setYourAdsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const isFocused = useIsFocused();
  const wasFocused = useRef(false);

  useEffect(() => {
    if (isFocused && !wasFocused.current) {
      // Reload the screen when it comes into focus
      getUserAds();
      console.log('loaded! 29 yourads');
    }
    // Update the previous focus state
    wasFocused.current = isFocused;
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.showAlert) {
      setShowAlert(true);
    }
  }, [route.params?.showAlert]);

  const getUserAds = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userInfo');
      const [page, setPage] = useState(1);

      // console.log(JSON.parse(userData).id, '12 line');

      const yourAdsRespData = await http.get(
        `/user-ad/?user_id=${JSON.parse(userData).id}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(userAdsRespData.results, '21');
      const ads = yourAdsRespData.results.map((ad, index) => ({
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
        key: `${yourAdsData.length + index}`,
      }));
      // console.log(ads);
      setYourAdsData([...yourAdsData, ...ads]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.alert(
        'ERROR',
        'Something went wrong, we are working on it YourAds',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }
  };

  const fetchNextPage = async () => {
    setPage(page + 1);
    // Call your API to fetch the data for the next page
    await getUserAds();
  };

  const CARD_HEIGHT = 120;
  const getYourAdsCardLayout = (_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });

  const renderYourAds = ({item, index}) => {
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
              showCallNowBtn: false,
              showDeleteBtn: true,
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
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcon name="arrow-back" color={'#111'} size={28} />
        </TouchableOpacity>

        <Text style={styles.headingText}>Your Ads</Text>
      </View>
      <View style={styles.yourAdsSection}>
        <FlatList
          data={yourAdsData}
          renderItem={renderYourAds}
          getItemLayout={getYourAdsCardLayout}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.1}
        />
      </View>

      {showAlert &&
        Alert.alert(
          `${route.params.alertHeading}`,
          `${route.params.alertMsg}`,
          [
            {
              text: `${route.params.btnText}`,
              onPress: () => setShowAlert(false),
            },
          ],
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 0.7,
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 15,
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    gap: 20,
  },
  headingText: {fontSize: 18, color: '#111'},
  yourAdsSection: {
    flex: 10,
    marginTop: '2%',
    marginHorizontal: '3%',
  },
});
