/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {
  Avatar,
  Title,
  TouchableRipple,
  Text,
  Caption,
} from 'react-native-paper';
import {AuthContext} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator} from 'react-native';

export default function ProfileScreen() {
  const {logout} = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getInfo = async () => {
    setIsLoading(true);
    const userData = await AsyncStorage.getItem('userInfo');
    console.log(userData, '25');
    setUserInfo(JSON.parse(userData));
    setIsLoading(false);
  };

  useEffect(() => {
    getInfo();
  }, []);
  console.log(userInfo);
  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={styles.userInfoHeader}>
          <Avatar.Image source={{uri: userInfo.profile_image}} size={80} />
          <View style={{marginLeft: '4%'}}>
            <Title style={styles.title}>
              {userInfo.first_name + ' ' + userInfo.last_name}
            </Title>
            <Caption style={styles.caption}>
              {`@${userInfo.first_name}${userInfo.last_name}`.toLowerCase()}
            </Caption>
          </View>
        </View>
        <View style={styles.userInfoBody}>
          <View style={styles.row}>
            <MaterialIcon
              name="location-pin"
              size={styles.rowIcon.size}
              color={styles.rowIcon.color}
            />
            <Text style={styles.rowText}>{userInfo?.area?.name}</Text>
          </View>
          <View style={styles.row}>
            <MaterialIcon
              name="phone"
              size={styles.rowIcon.size}
              color={styles.rowIcon.color}
            />
            <Text style={styles.rowText}>{userInfo.phone}</Text>
          </View>
          <View style={styles.row}>
            <MaterialIcon
              name="email"
              size={styles.rowIcon.size}
              color={styles.rowIcon.color}
            />
            <Text style={styles.rowText}>{userInfo.email}</Text>
          </View>
        </View>
      </View>
      <View style={styles.menuSection}>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItems}>
            <Ionicons
              name="heart-outline"
              color={styles.menuItemIcon.color}
              size={styles.menuItemIcon.size}
            />
            <Text style={styles.menuItemText}>Saved Ads</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItems}>
            <Ionicons
              name="share-social-outline"
              color={styles.menuItemIcon.color}
              size={styles.menuItemIcon.size}
            />
            <Text style={styles.menuItemText}>Share</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItems}>
            <MaterialIcon
              name="support-agent"
              color={styles.menuItemIcon.color}
              size={styles.menuItemIcon.size}
            />
            <Text style={styles.menuItemText}>Support</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            logout();
          }}>
          <View style={styles.menuItems}>
            <Ionicons
              name="heart-outline"
              color={styles.menuItemIcon.color}
              size={styles.menuItemIcon.size}
            />
            <Text style={styles.menuItemText}>Logout</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItems}>
            <Ionicons
              name="settings-outline"
              color={styles.menuItemIcon.color}
              size={styles.menuItemIcon.size}
            />
            <Text style={styles.menuItemText}>Setting</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    flex: 0.5,
    paddingHorizontal: 20,
  },
  userInfoHeader: {flex: 1, flexDirection: 'row', marginTop: '5%'},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
  },
  userInfoBody: {flex: 1},
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  rowIcon: {color: '#222', size: 20},
  rowText: {color: '#222', marginLeft: 10},
  menuSection: {flex: 1},
  menuItems: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingLeft: 10,
  },
  menuItemText: {
    color: '#222',
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 16,
  },
  menuItemIcon: {
    color: '#FA8C00',
    size: 20,
  },
});
