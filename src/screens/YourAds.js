import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function YourAds({navigation}) {
  const [yourAdsData, setYourAdsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getUserAds = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userInfo');

      // console.log(JSON.parse(userData).id, '12 line');

      const userAdsRespData = await http.get(
        `/user-ad/?user_id=${JSON.parse(userData).id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(userAdsRespData.results, '21');
      const ads = userAdsRespData.results.map(ad => ({
        id: ad.id.toString(),
        title: ad.name,
        createdDate: ad.created_date,
        description: ad.description,
        images: ad.images,
        isFeatured: ad.is_featured,
        price: ad.price,
      }));
      console.log(ads);
      setYourAdsData(ads);
      setIsLoading(false);
    } catch (err) {
      console.log(
        'Something went wrong while fetching user ad line 28 YourAds',
        JSON.stringify(err),
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserAds();
  }, []);

  const CARD_HEIGHT = 100;
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
          borderBottomWidth: 0.5,
          paddingTop: 5,
        }}>
        <View style={{width: 100, height: 100}}>
          <Image
            source={{uri: item.images[0].image, width: 100, height: 100}}
            style={{resizeMode: 'contain'}}
          />
        </View>

        <View>
          <Text style={{fontSize: 16, color: '#222', marginLeft: 10}}>
            {item.title}
          </Text>
          <Text style={{fontSize: 16, color: '#222', marginLeft: 10}}>
            ₹ {item.price}
          </Text>
          <Text style={{fontSize: 16, color: '#222', marginLeft: 10}}>
            {item.description}
          </Text>
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
        />
      </View>
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
  yourAdsSection: {flex: 10},
});
