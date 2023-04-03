import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {React, useCallback, useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import CustomButton from '../shared/components/CustomButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function Home({navigation}) {
  const services = [
    {
      title: 'Mobile Repair',
      icon: 'miscellaneous-services',
      onpress: () => navigation.navigate('ServiceDescription', {serviceId: 1}),
    },
    {title: 'service2', icon: 'miscellaneous-services'},
    {title: 'service3', icon: 'miscellaneous-services'},
    {title: 'service4', icon: 'miscellaneous-services'},
    {title: 'service5', icon: 'miscellaneous-services'},
    {title: 'service7', icon: 'miscellaneous-services'},
    {title: 'service8', icon: 'miscellaneous-services'},
    {title: 'service9', icon: 'miscellaneous-services'},
    {title: 'service10', icon: 'miscellaneous-services'},
    {title: 'service11', icon: 'miscellaneous-services'},
    {title: 'service12', icon: 'miscellaneous-services'},
    {title: 'service13', icon: 'miscellaneous-services'},
    {title: 'service14', icon: 'miscellaneous-services'},
    {title: 'service15', icon: 'miscellaneous-services'},
    {title: 'service16', icon: 'miscellaneous-services'},
  ];

  const numColumns = 3;
  const CARD_HEIGHT = 50;
  const getServiceCardLayout = (_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });
  const formatData = (services, numColumns) => {
    const numberOfFullRows = Math.floor(services.length / numColumns);
    let numberOfItemsLastRow = services.length - numberOfFullRows * numColumns;
    while (numberOfItemsLastRow !== numColumns && numberOfItemsLastRow !== 0) {
      services.push({key: `blank-${numberOfItemsLastRow}`, empty: true});
      numberOfItemsLastRow++;
    }
    return services;
  };

  const renderServiceList = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={{
          height: CARD_HEIGHT,
          flex: 2,
          marginTop: 30,
        }}
        onPress={item.onpress}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcon name={item.icon} size={35} color={'#000'} />
          <Text
            style={{
              fontSize: 16,
              color: '#111',
            }}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [],
  );
  return (
    <View style={styles.container}>
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
          data={formatData(services, numColumns)}
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
    </View>
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
    padding: '5%',
  },
});
