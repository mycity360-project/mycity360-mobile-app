import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import {React, useCallback, useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import CustomButton from '../shared/components/CustomButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function Home() {
  const {logout} = useContext(AuthContext);

  const data = [
    {
      key: '1',
      title: 'Electronics',
      icon: 'live-tv',
      onpress: () => alert('Tv'),
    },
    {
      key: '2',
      title: 'Bike',
      icon: 'two-wheeler',
      onpress: () => alert('bike'),
    },
    {key: '3', title: 'Mobile', icon: 'phone-android'},
    {
      key: '4',
      title: 'Properties',
      icon: 'house',
    },
    {key: '5', title: 'Jobs', icon: 'work-outline'},
    {key: '6', title: 'Jobs', icon: 'work-outline'},
    {key: '7', title: 'Jobs', icon: 'work-outline'},
    {
      key: 8,
      title: 'Electronics',
      icon: 'live-tv',
    },
    {key: 9, title: 'Mobile', icon: 'phone-android'},
    {key: 10, title: 'Mobile', icon: 'phone-android'},
  ];
  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity style={styles.category} onPress={item.onpress}>
        <MaterialIcon name={item.icon} size={43} color={'#000'} />
        <Text style={{fontSize: 16, color: '#111'}}>{item.title}</Text>
      </TouchableOpacity>
    ),
    [],
  );
  const ITEM_WIDTH = 90;
  const getItemLayout = (_, index) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });
  const width = Dimensions.get('window').width;
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <View style={styles.btnConatiner}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Ads')}
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
                onPress={() => navigation.navigate('Services')}
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

            <View style={styles.searchBarContainer}>
              <TextInput
                placeholder="Search Bar"
                style={styles.searchInput}
                onChangeText={text => {}}
              />
            </View>
          </View>
          <View style={styles.categoryContainer}>
            <TouchableOpacity style={styles.sellBtn}>
              <MaterialIcon
                name="add-circle-outline"
                color={'#FF8C00'}
                size={40}
              />
              <Text style={{fontSize: 18, color: '#000'}}>Sell</Text>
            </TouchableOpacity>

            <FlatList
              horizontal={true}
              data={data}
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
              getItemLayout={getItemLayout}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
            />

            {/* <ScrollView
              horizontal
              decelerationRate={'fast'}
              showsHorizontalScrollIndicator={false}>
              {data.map(item => {
                return (
                  <View key={item.key} style={styles.categoryList}>
                    <MaterialIcon name={item.icon} size={23} color={'#000'} />
                    <Text
                      style={{fontSize: 16, fontWeight: 500, color: '#111'}}>
                      {item.title}
                    </Text>
                  </View>
                );
              })}
            </ScrollView> */}
          </View>

          <View style={styles.featuredAds}></View>
          <View style={styles.btmTab}></View>
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
    flex: 0.7,
  },
  btnConatiner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    width: '85%',
    backgroundColor: '#EFEFEF',
    height: '85%',
    borderRadius: 20,
    padding: 10,
    elevation: 5, //Android Only
    shadowRadius: 5, // IOS Only
  },
  searchIcon: {
    marginRight: '40%',
  },
  categoryContainer: {
    flex: 0.5,
    flexDirection: 'row',
  },
  sellBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    marginLeft: '1%',
  },
  category: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImg: {width: 35, height: 35},
  featuredAds: {flex: 3},
  btmTab: {flex: 1},
});
