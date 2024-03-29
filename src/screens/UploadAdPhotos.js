/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Text,
  Alert,
  Platform,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '../shared/components/CustomButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {MAX_IMAGE_ALLOWED} from '../shared/constants/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import {request, PERMISSIONS} from 'react-native-permissions';
import Loader from '../shared/components/Loader';
const {width, height} = Dimensions.get('window');
import {Image as ImageCompressor} from 'react-native-compressor';

export default function UploadAdPhotos({navigation, route}) {
  let [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(Number(0));
  const [maxImageExceed, setMaxImageExceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(1);
  const ref = useRef();
  const AdData = route.params?.AdData;

  const removeFromArray = idToRemove => {
    const imagesUpdated = images.filter(item => {
      return item.id !== idToRemove;
    });
    setImages(imagesUpdated);

    if (parseInt(currentIndex)) {
      ref.current.scrollToIndex({
        Animated: true,
        index: currentIndex - 1,
      });
    }
  };

  const askForPermission = permission => {
    return request(permission);
  };

  const openCamera = () => {
    const options = {
      storageOptions: {path: 'images', mediaType: 'photo'},
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 1,
      mediaType: 'photo',
    };

    launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const resp = response?.assets?.[0];
        let url = await ImageCompressor.compress(resp.uri, {
          compressionMethod: 'auto',
          returnableOutputType: 'uri',
          maxWidth: 1024,
          maxHeight: 1024,
          quality: 0.8,
        });
        const source = {
          id: id,
          uri: url,
          type: resp?.type,
        };

        const updatedImages = images;

        if (updatedImages.length >= MAX_IMAGE_ALLOWED) {
          setMaxImageExceed(true);
        } else {
          setMaxImageExceed(false);
          updatedImages.push(source);
          setImages(updatedImages);
          setId(id + 1);
        }
      }
    });
  };

  const openGallery = () => {
    const options = {
      storageOptions: {path: 'images', mediaType: 'photo'},
      selectionLimit: 0,
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 1,
      mediaType: 'photo',
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const responseLength = response.assets.length;
        if (responseLength === 1) {
          setMaxImageExceed(false);
          const resp = response.assets[0];
          let url = await ImageCompressor.compress(resp.uri, {
            compressionMethod: 'auto',
            returnableOutputType: 'uri',
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.8,
          });
          const source = {
            id: id,
            uri: url,
            type: resp.type,
          };

          const updatedImages = [];
          updatedImages.push(source);
          setImages(updatedImages);
          setId(id + 1);
        } else if (responseLength > 1 && responseLength <= MAX_IMAGE_ALLOWED) {
          setMaxImageExceed(false);
          let count = id;
          let updatedImages = [];
          response.assets.map((item, index) => {
            const source = {id: count, uri: item.uri, type: item.type};
            updatedImages.push(source);
            count++;
          });
          setImages(updatedImages);
          setId(count + 1);
        } else {
          setMaxImageExceed(true);
        }
      }
    });
  };

  const uploadImage = async path => {
    try {
      const imageData = new FormData();

      imageData.append('file', {
        uri: path.uri,
        name: 'Ad.jpg',
        type: path.type,
      });

      const token = await AsyncStorage.getItem('token');

      const url = 'image/';
      const config = {
        headers: {
          ' Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      return http.post(url, imageData, config);
    } catch (error) {
      throw new Error(error);
    }
  };

  const createAdHandler = async imagesResp => {
    try {
      const userid = await AsyncStorage.getItem('userID');
      const token = await AsyncStorage.getItem('token');
      const info = await AsyncStorage.getItem('userInfo');
      const userData = JSON.parse(info);
      const areaid = userData.area?.id;

      const data = {
        images: imagesResp,
        user: {
          id: Number(userid),
        },
        category: {
          id: Number(AdData.subCategoryID),
        },
        area: {
          id: Number(areaid),
        },
        name: AdData.title,
        description: AdData.description,
        price: AdData.price,
        tags: [],
      };

      const url = 'user-ad/';

      const config = {
        headers: {
          ' Authorization': `Bearer ${token}`,
        },
      };

      return await http.post(url, data, config);
    } catch (error) {
      throw error;
    }
  };

  const uploadAnswer = async (answer, userid, adID) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const data = {
        user: {
          id: Number(userid),
        },
        user_ad: {
          id: Number(adID),
        },
        question: {
          id: Number(answer.id),
        },
        answer: answer.answer,
      };
      const url = 'answer/';
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      return http.post(url, data, config);
    } catch (error) {
      throw new Error(error);
    }
  };

  const submitAdDataHandler = async () => {
    try {
      setIsLoading(true);
      //upload image one by one
      if (images.length === 0) {
        setIsLoading(false);
        Alert.alert('ERROR', 'Please Upload atleast 1 Image', [{text: 'OK'}]);
        return;
      }

      let uploadedImgArr = [];
      for (const image of images) {
        uploadedImgArr.push(uploadImage(image));
      }

      uploadedImgArr = await Promise.all(uploadedImgArr);

      const adCreatedData = await createAdHandler(uploadedImgArr);

      let answerArr = AdData.answers;
      let respArr = [];
      const userid = await AsyncStorage.getItem('userID');
      for (const answer of answerArr) {
        respArr.push(uploadAnswer(answer, userid, adCreatedData.id));
      }
      respArr = await Promise.all(respArr);
      setIsLoading(false);
      navigation.popToTop();
    } catch (error) {
      console.log(JSON.stringify(error), 'Upload Add error');
      if (error?.code === 'ERR_NETWORK') {
        Alert.alert('ERROR', 'Your Internet is not working. Please try again', [
          {
            text: 'OK',
          },
        ]);
      } else {
        Alert.alert(
          'ERROR',
          'Something went wrong, Ad not created. We are working on it, Please try after some time.',
          [
            {
              text: 'OK',
              onPress: () => navigation.popToTop(),
            },
          ],
        );
      }
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.wrapper,
          {
            borderBottomColor: '#999',
            borderBottomWidth: 1,
            backgroundColor: '#e0e0e0',
          },
        ]}>
        <FlatList
          data={images}
          ref={ref}
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
              <View>
                <Image
                  source={{uri: item?.uri}}
                  resizeMode="contain"
                  style={styles.wrapper}
                />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => removeFromArray(item.id)}>
                  <MaterialIcon name="close" color={'#222'} size={28} />
                </TouchableOpacity>
              </View>
            );
          }}
        />

        <View style={styles.dotWrapper}>
          {images.map((e, index) => {
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
        {images.length ? (
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              marginRight: 15,
              marginBottom: 10,
            }}>
            <Text allowFontScaling={false} style={{color: '#222'}}>
              {parseInt(currentIndex) + 1}/{images.length}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardButtonSection}>
        <Text
          allowFontScaling={false}
          style={{color: '#222', textAlign: 'center', fontWeight: 500}}>
          * Select only {MAX_IMAGE_ALLOWED} images to Upload.
        </Text>
        {maxImageExceed &&
          Alert.alert(
            'ERROR',
            `* Please Select upto ${MAX_IMAGE_ALLOWED} images only.`,
            [{text: 'OK', onPress: () => setMaxImageExceed(false)}],
          )}

        <View style={{flex: 1, flexDirection: 'row', marginTop: '3%'}}>
          <TouchableOpacity
            style={styles.btn}
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
            }}>
            <MaterialIcon
              name={'camera'}
              size={30}
              color={'#222'}
              style={{flex: 1}}
            />
            <Text
              allowFontScaling={false}
              style={{color: '#222', flex: 1, fontSize: 16}}>
              Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
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
            }}>
            <MaterialIcon
              name={'folder-open'}
              size={30}
              color={'#222'}
              style={{flex: 1}}
            />
            <Text
              allowFontScaling={false}
              style={{color: '#222', flex: 1, fontSize: 16}}>
              Gallery
            </Text>
          </TouchableOpacity>
        </View>
        <CustomButton
          btnTitle="Publish Ad"
          onpress={() => submitAdDataHandler()}
        />
      </View>
      <Loader visible={isLoading} text={'Publishing Your Ad...'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  wrapper: {width: width, height: height * 0.3},
  removeImageBtn: {position: 'absolute', right: 30, top: 10},
  btn: {
    width: '20%',
    height: '15%',
    padding: 5,
    backgroundColor: '#ececec',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.1,
    marginRight: 15,
    elevation: 5,
    shadowOffset: 5,
  },
  dotWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
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
  cardButtonSection: {
    flex: 1,
    padding: '2%',
  },
});
