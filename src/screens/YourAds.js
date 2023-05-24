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
import React, {useState, useEffect, useRef, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

export default function YourAds({navigation, route}) {
  const [yourAdsData, setYourAdsData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const isFocused = useIsFocused();
  const wasFocused = useRef(false);
  const [flatlistLoading, setFlatlistLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showNoAdsFoundMsg, setShowNoAdsFoundMsg] = useState(false);
  const pageSize = 10;
  const {logout} = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      if (isFocused && !wasFocused.current) {
        // Reload the screen when it comes into focus
        setPage(1);
        await getUserAds();
        if (route.params?.showAlert) {
          setShowAlert(true);
        }
      }
      // Update the previous focus state
      wasFocused.current = isFocused;
    })();
  }, [isFocused]);

  const getUserAds = async () => {
    try {
      setFlatlistLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userInfo');
      const url = `/user-ad/?user_id=${JSON.parse(userData).id}&page=${page}`;
      const yourAdsRespData = await http.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHasMore(page <= Math.ceil(yourAdsRespData.count) / pageSize);
      setShowNoAdsFoundMsg(Math.ceil(yourAdsRespData.count) ? false : true);
      const ads = yourAdsRespData.results?.map((ad, index) => ({
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
        isPrice: ad.category?.is_price,
        key: `${yourAdsData.length + index}`,
      }));

      if (page === 1) {
        setYourAdsData(ads);
      } else {
        setYourAdsData([...yourAdsData, ...ads]);
      }
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      } else {
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
    } finally {
      setFlatlistLoading(false);
    }
  };

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
          No Ads Found.
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
          <Text
            numberOfLines={2}
            allowFontScaling={false}
            style={{fontSize: 16, color: '#111', fontWeight: 500}}>
            {item.title}
          </Text>
          <Text
            allowFontScaling={false}
            style={{fontSize: 16, color: '#111', fontWeight: 500}}>
            ₹ {item.price}
          </Text>
          <Text
            allowFontScaling={false}
            style={{fontSize: 16, color: '#111', fontWeight: 500}}>
            Ad ID:{item.id}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcon name="arrow-back" color={'#111'} size={28} />
        </TouchableOpacity>

        <Text allowFontScaling={false} style={styles.headingText}>
          Your Ads
        </Text>
      </View>
      <View style={styles.yourAdsSection}>
        <FlatList
          data={yourAdsData}
          renderItem={renderYourAds}
          getItemLayout={getYourAdsCardLayout}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
          onEndReached={!flatlistLoading && hasMore ? handleLoadMore : null}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
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
