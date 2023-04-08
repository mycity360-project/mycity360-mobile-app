/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function AdDescription({route, navigation}) {
  // Data from API call for specific ad, for now using dummy data
  // const data=[];
  const {title, price, location} = route.params;
  return (
    <View style={styles.container}>
      <View style={styles.adHeaderSection}>
        <View style={styles.adImgSection}>
          <Image
            source={require('../assets/images/mobile.png')}
            style={{height: '90%', resizeMode: 'contain'}}
          />
        </View>
        <View style={styles.adInfoSection}>
          <View style={styles.infoSectionTop}>
            <Text style={styles.priceText}>₹ {price}</Text>
            <MaterialIcon name="favorite-border" size={28} />
          </View>

          <Text numberOfLines={1} style={styles.infoSectionMiddle}>
            {title}
          </Text>
          <View style={styles.infoSectionBottom}>
            <View style={styles.locationSection}>
              <MaterialIcon name="location-pin" size={18} color={'#444'} />
              <Text style={styles.locationText}>{location}</Text>
            </View>
            <Text style={styles.dateAdded}>25 March 2023</Text>
          </View>
        </View>
      </View>

      <View style={styles.adDetailsSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Details
        </Text>
        <View style={{fontSize: 14, marginLeft: '20%'}}>
          <Text>Brand: Mi</Text>
          <Text>RAM: 8 GB</Text>
          <Text>Memory : 64 GB</Text>
        </View>
      </View>

      <View style={styles.adDescriptionSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Description
        </Text>
        <Text>Will display user entered description here</Text>
      </View>

      <View style={styles.otherDetailsSection}>
        <Text style={styles.otherDetailsText}>Ad ID: 323452</Text>
        <Text style={styles.otherDetailsText}>Report Ad</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.makeOfferButton}>
          <Text style={styles.makeOfferButtonText}>Make Offer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  adHeaderSection: {flex: 4},
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
});
