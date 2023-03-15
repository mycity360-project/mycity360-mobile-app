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
  FlatList,
  SectionList,
  ScrollView,
} from 'react-native';
import {React, useCallback, useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import CustomButton from '../shared/components/CustomButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function Home() {
  const {logout} = useContext(AuthContext);
  const data = [
    {key: 1, title: 'Bike', imgUri: require('../assets/icons/bike.png')},
    {
      key: 2,
      title: 'Electronics',
      imgUri: require('../assets/icons/electronics.png'),
    },
    {key: 3, title: 'Mobile', imgUri: require('../assets/icons/mobile.png')},
    {
      key: 4,
      title: 'Properties',
      imgUri: require('../assets/icons/properties.png'),
    },
    {key: 5, title: 'Jobs', imgUri: require('../assets/icons/jobs.png')},
    {key: 6, title: 'Jobs', imgUri: require('../assets/icons/jobs.png')},
    {key: 7, title: 'Jobs', imgUri: require('../assets/icons/jobs.png')},
    {
      key: 8,
      title: 'Electronics',
      imgUri: require('../assets/icons/electronics.png'),
    },
    {key: 9, title: 'Mobile', imgUri: require('../assets/icons/mobile.png')},
    {
      key: 10,
      title: 'Properties',
      imgUri: require('../assets/icons/properties.png'),
    },
  ];

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
            <TouchableOpacity style={styles.sellContainer}>
              <Image
                source={require('../assets/icons/Sell.png')}
                style={{width: 30, height: 30}}
              />
              <Text style={{fontSize: 16, fontWeight: 500, color: '#111'}}>
                Sell
              </Text>
            </TouchableOpacity>

            <ScrollView
              horizontal
              decelerationRate={'normal'}
              showsHorizontalScrollIndicator={false}>
              {data.map(item => {
                return (
                  <View key={item.key} style={styles.categoryList}>
                    <Image source={item.imgUri} style={styles.categoryImg} />
                    <Text
                      style={{fontSize: 16, fontWeight: 500, color: '#111'}}>
                      {item.title}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
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
    // backgroundColor: '#456235',
  },
  header: {
    flex: 0.7,
    // backgroundColor: '#982019',
  },
  btnConatiner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#000',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#444',
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
    flex: 0.4,
    flexDirection: 'row',
    // backgroundColor: '#456490',
    padding: 5,
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellContainer: {
    marginLeft: '1%',
    alignItems: 'center',
    // backgroundColor: '#555',
    width: '12%',
  },
  categoryList: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },
  categoryImg: {width: 30, height: 30},
  featuredAds: {flex: 3},
  btmTab: {flex: 1},
});
