/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Linking,
  Platform,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';

const {width, height} = Dimensions.get('window');

export default function ServiceDescription({route, navigation}) {
  const {title, description, phone, images, serviceID} = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);

  const openDialer = () => {
    Platform.OS === 'ios'
      ? Linking.openURL(`telprompt:${phone}`)
      : Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.adHeaderSection}>
        <View style={styles.adImgSection}>
          <FlatList
            data={images}
            keyExtractor={item => item.id}
            onScroll={event => {
              const x = event.nativeEvent.contentOffset.x;
              setCurrentIndex((x / width).toFixed(0));
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            renderItem={({item, index}) => {
              return (
                <Image
                  source={{uri: item.image}}
                  resizeMode="contain"
                  style={styles.wrapper}
                />
              );
            }}
          />

          <View style={styles.dotWrapper}>
            {images?.map((e, index) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.dotCommon,
                    parseInt(currentIndex) === index
                      ? styles.dotActive
                      : styles.dotNotActive,
                  ]}
                />
              );
            })}
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 10,
              left: 15,
            }}
            onPress={() => {
              navigation.goBack();
            }}>
            <MaterialIcon name="arrow-back" size={24} color={'#222'} />
          </TouchableOpacity>
        </View>
        <View style={styles.adInfoSection}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <View style={styles.adDescriptionSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Description
        </Text>
        <Text style={{color: '#111'}}>{description}</Text>
      </View>

      <View style={styles.otherDetailsSection}>
        <Text style={styles.otherDetailsText}>Service ID: {serviceID}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={openDialer}>
          <Text style={styles.buttonText}>Call Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  adHeaderSection: {flex: 2, paddingTop: 5},
  adImgSection: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adInfoSection: {
    flex: 1,
    padding: 5,
    marginTop: '2%',
    backgroundColor: '#FFF',
  },
  title: {fontSize: 16, fontWeight: 500, color: '#222'},
  adDescriptionSection: {
    flex: 2,
    padding: 5,
    marginTop: '2%',
    backgroundColor: '#FFF',
  },
  otherDetailsSection: {
    flex: 0.2,
    justifyContent: 'center',
    padding: 5,
    marginTop: '2%',
    backgroundColor: '#FFF',
  },
  otherDetailsText: {fontSize: 14, color: '#111', fontWeight: 500},
  footer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#FA8C00',
    width: '70%',
    height: '60%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#111',
    fontWeight: 500,
  },

  wrapper: {width: width, height: height * 0.3},

  dotWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
  },
  dotCommon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#222',
  },
  dotActive: {
    backgroundColor: '#FA8C00',
  },
  dotNotActive: {
    backgroundColor: '#fff',
  },
});
