import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import style from '../shared/constants/style';

export default function ServiceDescription({route, navigation}) {
  // Data from API call for specific ad, for now using dummy data
  // const data=[];
  const {title, price, serviceId} = route.params;
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
            <Text style={styles.priceText}>Mobile Repair</Text>
          </View>

          <Text numberOfLines={1} style={styles.infoSectionMiddle}>
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.adDetailsSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Details
        </Text>
        <View style={{fontSize: 14, marginLeft: '20%'}}>
          <Text>Key Points of Service </Text>
        </View>
      </View>

      <View style={styles.adDescriptionSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Description
        </Text>
        <Text>Description of service </Text>
      </View>

      <View style={styles.otherDetailsSection}>
        <Text style={styles.otherDetailsText}>Service ID: 323452</Text>
        <Text style={styles.otherDetailsText}>Report</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.makeOfferButton}>
          <Text style={styles.makeOfferButtonText}>Call Now</Text>
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
