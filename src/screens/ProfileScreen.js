/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Linking,
  Pressable,
} from 'react-native';
import {Title, TouchableRipple, Text, Caption} from 'react-native-paper';
import {AuthContext} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ActivityIndicator} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import {http} from '../shared/lib';
import {request, PERMISSIONS} from 'react-native-permissions';
import {
  DEACTIVATE_ACCOUNT,
  FACEBOOK_APP,
  FACEBOOK_WEB,
  INSTAGRAM_APP,
  INSTAGRAM_WEB,
  WHATSAPP_APP,
  WHATSAPP_WEB,
} from '../shared/constants/env';

export default function ProfileScreen({navigation}) {
  const {logout, userInfo: userDetails} = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [profileImage, setProfileImage] = useState({});

  const getInfo = async () => {
    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem('userInfo');
      const info = JSON.parse(userData);
      setUserInfo(info);
      setProfileImage({uri: info.profile_image});
      setIsLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      } else {
        Alert.alert('ERROR', 'Something went wrong in loading Profile Image', [
          {
            text: 'OK',
          },
        ]);
      }
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const askForPermission = permission => {
    return request(permission);
  };

  const openCamera = () => {
    const options = {
      storageOptions: {path: 'images', mediaType: 'photo'},
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {
          uri: response?.assets?.[0]?.uri,
          type: response?.assets?.[0].type,
        };
        setShowImagePicker(false);
        uploadImage(source);
      }
    });
  };

  const openGallery = () => {
    const options = {
      storageOptions: {path: 'images', mediaType: 'photo'},
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
        };
        uploadImage(source);
        setShowImagePicker(false);
      }
    });
  };

  const uploadImage = async path => {
    try {
      setIsLoading(true);
      const imageData = new FormData();
      imageData.append('file', {
        uri: path.uri,
        name: userInfo.first_name,
        type: path.type,
      });
      const token = await AsyncStorage.getItem('token');
      const userid = userInfo.id;
      const url = `user/image/${userid}/`;
      const config = {
        headers: {
          ' Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const resp = await http.post(url, imageData, config);
      const info = await AsyncStorage.getItem('userInfo');
      let {localUserArea} = JSON.parse(info);
      resp.localUserArea = localUserArea;
      await AsyncStorage.setItem('userInfo', JSON.stringify(resp));
      setProfileImage({uri: resp.profile_image});
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      } else {
        Alert.alert(
          'ERROR',
          'Something went wrong, Profile Image not uploaded',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={'#FA8C00'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={styles.userInfoHeader}>
          <ImageBackground
            source={
              profileImage.uri == null
                ? require('../assets/icons/account.png')
                : profileImage
            }
            style={{width: 100, height: 100}}
            imageStyle={{
              borderRadius: 50,
            }}>
            {userDetails.role !== 'Guest' && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  position: 'absolute',
                  bottom: 10,
                  right: 0,
                }}
                onPress={() => setShowImagePicker(true)}>
                <MaterialIcon name="photo-camera" color={'#FA8C00'} size={26} />
              </TouchableOpacity>
            )}
          </ImageBackground>

          <View style={{paddingLeft: 15, paddingTop: 15}}>
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
            <Text allowFontScaling={false} style={styles.rowText}>
              {userInfo?.area?.name}
            </Text>
          </View>
          {userDetails.role !== 'Guest' && (
            <>
              <View style={styles.row}>
                <MaterialIcon
                  name="phone"
                  size={styles.rowIcon.size}
                  color={styles.rowIcon.color}
                />
                <Text allowFontScaling={false} style={styles.rowText}>
                  {userInfo.phone}
                </Text>
              </View>
              <View style={styles.row}>
                <MaterialIcon
                  name="email"
                  size={styles.rowIcon.size}
                  color={styles.rowIcon.color}
                />
                <Text allowFontScaling={false} style={styles.rowText}>
                  {userInfo.email}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
      <View style={styles.menuSection}>
        <TouchableRipple
          style={{paddingTop: 30}}
          onPress={() => {
            Linking.openURL(INSTAGRAM_APP).catch(() => {
              navigation.navigate('WebViewScreen', {
                uri: INSTAGRAM_WEB,
              });
            });
          }}>
          <View style={styles.menuItems}>
            <MaterialCommunityIcons
              name="instagram"
              color={styles.menuItemIcon.color}
              size={styles.menuItemIcon.size}
            />

            <Text allowFontScaling={false} style={styles.menuItemText}>
              Instagram
            </Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            Linking.openURL(FACEBOOK_APP).catch(() => {
              navigation.navigate('WebViewScreen', {
                uri: FACEBOOK_WEB,
              });
            });
          }}>
          <View style={styles.menuItems}>
            <MaterialCommunityIcons
              name="facebook"
              color={styles.menuItemIcon.color}
              size={styles.menuItemIcon.size}
            />
            <Text allowFontScaling={false} style={styles.menuItemText}>
              Facebook
            </Text>
          </View>
        </TouchableRipple>
        {userDetails.role !== 'Guest' && (
          <TouchableRipple
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                uri: DEACTIVATE_ACCOUNT,
              });
            }}>
            <View style={styles.menuItems}>
              <MaterialIcon
                name="delete"
                color={styles.menuItemIcon.color}
                size={styles.menuItemIcon.size}
              />
              <Text allowFontScaling={false} style={styles.menuItemText}>
                Delete Account
              </Text>
            </View>
          </TouchableRipple>
        )}

        <TouchableRipple
          onPress={() => {
            logout();
          }}>
          <View style={styles.menuItems}>
            <MaterialIcon
              name="logout"
              color={styles.menuItemIcon.color}
              size={styles.menuItemIcon.size}
            />
            <Text allowFontScaling={false} style={styles.menuItemText}>
              Logout
            </Text>
          </View>
        </TouchableRipple>
      </View>
      <View style={{flex: 0.5, padding: 15}}>
        <Text style={{color: '#222', fontWeight: 700, fontSize: 16}}>
          Need help?
        </Text>
        <Pressable
          onPress={() => {
            Linking.openURL(WHATSAPP_APP).catch(() => {
              navigation.navigate('WebViewScreen', {
                uri: WHATSAPP_WEB,
              });
            });
          }}>
          <View
            style={
              (styles.menuItems,
              {
                backgroundColor: '#ebebeb',
                borderRadius: 5,
                padding: 5,
                flexDirection: 'row',
                height: '50%',

                marginTop: 10,
                alignItems: 'center',
              })
            }>
            <MaterialIcon
              name="support-agent"
              color={styles.menuItemIcon.color}
              size={styles.menuItemIcon.size}
            />
            <Text allowFontScaling={false} style={styles.menuItemText}>
              Ask us on Whatsapp
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={{padding: 5}}>
        <Text>Icons By Icons8. Visit https://icons8.com</Text>
      </View>
      <Modal
        isVisible={showImagePicker}
        style={{
          width: '100%',
          marginLeft: 0,
          marginBottom: 0,
        }}
        backdropOpacity={0.1}
        backdropColor="#999"
        animationIn={'slideInUp'}
        animationInTiming={400}
        hideModalContentWhileAnimating={true}
        onBackdropPress={() => setShowImagePicker(false)}
        onSwipeComplete={() => setShowImagePicker(false)}
        swipeDirection={'down'}>
        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 100,
            backgroundColor: '#f7f7f7',
            borderTopEndRadius: 15,
            borderTopStartRadius: 15,
            padding: 10,
            borderColor: '#999',
            borderBottomWidth: 0.4,
          }}>
          <TouchableOpacity
            onPress={async () => {
              let resp = '';
              if (Platform.OS === 'ios') {
                resp = await askForPermission(PERMISSIONS.IOS.CAMERA);
              } else {
                resp = await askForPermission(PERMISSIONS.ANDROID.CAMERA);
              }

              if (resp === 'granted') {
                openCamera();
              }
            }}
            style={{width: '100%', height: 40, flexDirection: 'row', gap: 5}}>
            <MaterialIcon name="photo-camera" size={24} color={'#222'} />
            <Text allowFontScaling={false} style={{fontSize: 18}}>
              Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              let resp = '';
              if (Platform.OS === 'ios') {
                resp = await askForPermission(
                  PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
                );
              } else {
                if (Platform.Version >= 33) {
                  resp = await askForPermission(
                    PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
                  );
                } else {
                  resp = await askForPermission(
                    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                  );
                }
              }

              if (resp === 'granted') {
                openGallery();
              }
            }}
            style={{width: '100%', height: 50, flexDirection: 'row', gap: 5}}>
            <MaterialIcon name="folder-open" size={24} color={'#222'} />
            <Text
              allowFontScaling={false}
              style={{fontSize: 18, color: '#111'}}>
              Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userInfoHeader: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: '5%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
  },
  userInfoBody: {flex: 1, paddingTop: '10%'},
  row: {
    flexDirection: 'row',
    padding: '1%',
  },
  rowIcon: {color: '#222', size: 20},
  rowText: {color: '#222', marginLeft: 10},
  menuSection: {flex: 1, marginLeft: '4%'},
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
