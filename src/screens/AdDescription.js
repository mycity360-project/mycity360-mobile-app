/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Linking,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

export default function AdDescription({route, navigation}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const adDetails = route.params.adDetails;
  const openDialer = contactNumber => {
    Platform.OS === 'ios'
      ? Linking.openURL(`telprompt:${contactNumber}`)
      : Linking.openURL(`tel:${contactNumber}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.adHeaderSection}>
        <View style={styles.adImgSection}>
          <FlatList
            data={adDetails.images}
            keyExtractor={item => item.id}
            onScroll={event => {
              const x = event.nativeEvent.contentOffset.x;
              console.log(x, (x / width).toFixed(0), 'line 84');
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
            {adDetails.images.map((e, index) => {
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
          <View style={styles.infoSectionTop}>
            <Text style={styles.priceText}>₹ {adDetails.price}</Text>
            <MaterialIcon name="favorite-border" size={28} />
          </View>

          <Text numberOfLines={1} style={styles.infoSectionMiddle}>
            {adDetails.title}
          </Text>
          <View style={styles.infoSectionBottom}>
            <View style={styles.locationSection}>
              <MaterialIcon name="location-pin" size={18} color={'#444'} />
              {/* <Text style={styles.locationText}>{location}</Text> */}
            </View>
            <Text style={styles.dateAdded}>{adDetails.createdOn}</Text>
          </View>
        </View>
      </View>

      <View style={styles.adDetailsSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Details
        </Text>
        <View style={{fontSize: 14, marginLeft: '20%'}} />
      </View>

      <View style={styles.adDescriptionSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Description
        </Text>
        <Text>{adDetails.description}</Text>
      </View>

      <View style={styles.otherDetailsSection}>
        <Text style={styles.otherDetailsText}>Ad ID: 323452</Text>
        <Text style={styles.otherDetailsText}>Report Ad</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.makeOfferButton}
          onPress={() => openDialer(adDetails.phone)}>
          <Text style={styles.makeOfferButtonText}>Call Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  adHeaderSection: {flex: 4, paddingTop: 5},
  adImgSection: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adInfoSection: {flex: 1, padding: 5},
  infoSectionTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {fontSize: 20, fontWeight: 600, color: '#111'},
  infoSectionMiddle: {
    flex: 1,
    fontSize: 16,
    width: '90%',
    color: '#000',
  },
  infoSectionBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  locationSection: {flexDirection: 'row'},
  locationText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#444',
  },
  dateAdded: {
    fontSize: 14,
    fontWeight: 500,
    color: '#444',
  },
  adDetailsSection: {flex: 1, padding: 5},
  adDescriptionSection: {flex: 2, padding: 5},
  otherDetailsSection: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  otherDetailsText: {fontSize: 14, color: '#111', fontWeight: 500},
  footer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  makeOfferButton: {
    backgroundColor: '#FA8C00',
    width: '70%',
    height: '60%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  makeOfferButtonText: {
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
    bottom: 10,
  },
  dotCommon: {width: 12, height: 12, borderRadius: 6, marginLeft: 5},
  dotActive: {
    backgroundColor: '#FA8C00',
  },
  dotNotActive: {
    backgroundColor: '#fff',
  },
});
