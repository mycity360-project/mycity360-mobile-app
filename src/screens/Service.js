/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import {React, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';

export default function Home({navigation}) {
  const [servicesData, setServicesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getServices = async () => {
    try {
      setIsLoading(true);
      console.log('inside get services');
      // const token = await AsyncStorage.getItem('token');
      console.log(token);
      const servicesRespData = await http.get('service/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(servicesRespData);
      const services = servicesRespData.map(service => ({
        key: service.id.toString(),
        title: service.name,
        icon: service.icon,
        description: service.description,
        phone: service.phone,
      }));
      setServicesData(services);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.alert('ERROR', 'Something went wrong, we are working on it', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
      // console.log(
      //   'Something went wrong while fetching services',
      //   JSON.stringify(err),
      // );
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const numColumns = 3;
  const CARD_HEIGHT = 65;
  const getServiceCardLayout = (_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });
  const formatData = (services, num) => {
    const numberOfFullRows = Math.floor(services.length / num);
    let numberOfItemsLastRow = services.length - numberOfFullRows * num;
    while (numberOfItemsLastRow !== num && numberOfItemsLastRow !== 0) {
      services.push({key: `blank-${numberOfItemsLastRow}`, empty: true});
      numberOfItemsLastRow++;
    }
    console.log(services);
    return services;
  };

  const renderServiceList = ({item}) => (
    <Pressable
      style={{
        height: CARD_HEIGHT,
        flex: 4,
        marginTop: 30,
      }}
      disabled={item.empty ? true : false}
      onPress={() =>
        navigation.navigate('ServiceDescription', {
          title: item.title,
          description: item.description,
          phone: item.phone,
        })
      }>
      {item.empty ? (
        // <View></View>
        ''
      ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1.3,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={{uri: item.icon, width: 45, height: 45}} />
          </View>
          <View
            style={{
              flex: 0.7,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#111',
              }}>
              {item.title}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.btnSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={{
              backgroundColor: '#BFBFBF',
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
              backgroundColor: '#FA8C00',
              width: '40%',
              height: '80%',
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#111'}}>Services</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.serviceListSection}>
        <FlatList
          data={formatData(servicesData, numColumns)}
          renderItem={renderServiceList}
          getItemLayout={getServiceCardLayout}
          numColumns={numColumns}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 0.5,
  },
  btnSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  serviceListSection: {
    flex: 6,
  },
});
