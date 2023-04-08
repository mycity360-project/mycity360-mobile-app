/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
  Platform,
} from 'react-native';
import React from 'react';

export default function ServiceDescription({route, navigation}) {
  const {title, description, phone} = route.params;

  const openDialer = contactNumber => {
    Platform.OS === 'ios'
      ? Linking.openURL(`telprompt:${contactNumber}`)
      : Linking.openURL(`tel:${contactNumber}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.imgSection}>
          <Image
            source={require('../assets/images/mobile.png')}
            style={{height: '90%', resizeMode: 'contain'}}
          />
        </View>
        <View style={styles.infoSection}>
          <View style={styles.infoSectionTop}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <Text numberOfLines={1} style={styles.infoSectionBottom}>
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Details
        </Text>
        <View style={{fontSize: 14, marginLeft: '20%'}}>
          <Text>Key Points of Service </Text>
        </View>
      </View>

      <View style={styles.descriptionSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Description
        </Text>
        <Text>{description} </Text>
      </View>

      <View style={styles.otherDetailsSection}>
        <Text style={styles.otherDetailsText}>Service ID: 323452</Text>
        <Text style={styles.otherDetailsText}>Report</Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.callButton} onPress={() => openDialer(phone)}>
          <Text style={styles.callButtonText}>Call Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  headerSection: {flex: 4},
  imgSection: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {flex: 1, padding: 5},
  infoSectionTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {fontSize: 20, fontWeight: 600, color: '#111'},
  // infoSectionMiddle: {
  //   flex: 1,
  //   fontSize: 16,
  //   width: '90%',
  //   color: '#000',
  // },

  detailsSection: {flex: 1, padding: 5},
  descriptionSection: {flex: 2, padding: 5},
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
  callButton: {
    backgroundColor: '#FA8C00',
    width: '70%',
    height: '60%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  callButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#111',
    fontWeight: 500,
  },
});
