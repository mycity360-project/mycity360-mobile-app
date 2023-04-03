import {SafeAreaView, StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import CustomButton from '../shared/components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Account() {
  const {logout} = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState('');
  const getInfo = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    setUserInfo(JSON.parse(userInfo));
  };
  useEffect(() => {
    getInfo();
  }, []);
  console.log(userInfo);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize: 18, color: '#222'}}>
          Hi, {userInfo.first_name}
        </Text>
      </View>
      <View style={styles.userProfileSection}>
        <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
          <Image
            source={require('../assets/images/profile.png')}
            style={{width: 100, height: 100}}
          />
          <View style={{flex: 4, padding: 5}}>
            <Text style={{flex: 0.1, fontSize: 18}}>
              User ID {userInfo.phone}
            </Text>
            <Text style={{flex: 0.1, fontSize: 18}}>
              First Name {userInfo.first_name}
            </Text>
            <Text style={{flex: 0.1, fontSize: 18}}>
              Last Name {userInfo.last_name}
            </Text>
            <Text style={{flex: 0.1, fontSize: 18}}>
              Email {userInfo.email}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.logoutSection}>
        <CustomButton btnTitle="Logout" onpress={() => logout()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 0.5,
    justifyContent: 'flex-end',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  userProfileSection: {flex: 6},
  logoutSection: {
    flex: 1,
  },
});
