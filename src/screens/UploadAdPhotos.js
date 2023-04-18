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
} from 'react-native';
import React, {useState, useRef} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '../shared/components/CustomButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {MAX_IMAGE_ALLOWED} from '../shared/constants/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
const {width, height} = Dimensions.get('window');

export default function UploadAdPhotos({navigation, route}) {
  let [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(Number(0));
  const [maxImageExceed, setMaxImageExceed] = useState(false);
  const [id, setId] = useState(1);
  const ref = useRef();
  const AdData = route.params.AdData;
  console.log(AdData);

  const buttonView = (name, iconName, open) => {
    return (
      <TouchableOpacity
        style={{
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
        }}
        onPress={() => open()}>
        <MaterialIcon
          name={iconName}
          size={30}
          color={'#222'}
          style={{flex: 1}}
        />
        <Text style={{color: '#222', flex: 1, fontSize: 16}}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const removeFromArray = idToRemove => {
    const imagesUpdated = images.filter(item => {
      return item.id !== idToRemove;
    });
    setImages(imagesUpdated);
    console.log(currentIndex, 'line 40');

    if (parseInt(currentIndex)) {
      console.log('inside scrollto');
      ref.current.scrollToIndex({
        Animated: true,
        index: currentIndex - 1,
      });
    }
  };

  const openCamera = () => {
    const options = {
      storageOptions: {path: 'images', mediaType: 'photo'},
      saveToPhotos: true,
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const resp = response.assets[0];
        console.log(resp, '86');
        const source = {
          id: id,
          uri: resp.uri,
          type: resp.type,
        };
        console.log(source, '92');

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
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response.assets);
        const responseLength = response.assets.length;
        if (responseLength == 1) {
          setMaxImageExceed(false);
          console.log('inside only 1');
          const resp = response.assets[0];

          const source = {
            id: id,
            uri: resp.uri,
            type: resp.type,
          };
          const updatedImages = [];
          updatedImages.push(source);
          setImages(updatedImages);
          setId(id + 1);
          console.log('executed only 1');
        } else if (responseLength > 1 && responseLength <= MAX_IMAGE_ALLOWED) {
          setMaxImageExceed(false);
          let count = id;
          let updatedImages = [];
          response.assets.map((item, index) => {
            const source = {id: count, uri: item.uri, type: item.type};
            updatedImages.push(source);
            count++;
            console.log(count, 'id after');
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
      console.log('143');
      const imageData = new FormData();
      console.log('145');

      imageData.append('file', {
        uri: path.uri,
        name: 'Ad.jpg',
        type: path.type,
      });
      console.log(JSON.stringify(imageData), '152');
      const token = await AsyncStorage.getItem('token');
      console.log('163');

      const url = 'image/';
      const config = {
        headers: {
          ' Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      console.log('172');
      const resp = await http.post(url, imageData, config);
      console.log(resp, '183');
      return resp;
    } catch (error) {
      console.log(JSON.stringify(error), 'in error image upload');
    }
  };

  const createAdHandler = async imagesResp => {
    try {
      const userid = await AsyncStorage.getItem('userID');
      const token = await AsyncStorage.getItem('token');
      const info = await AsyncStorage.getItem('userInfo');
      const userData = JSON.parse(info);
      const areaid = userData.area?.id;
      // console.log(info, '2020anu');
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
        price: Number(AdData.price),
        tags: [],
        code: Math.floor(Math.random() * 1000000000 + 1),
      };
      console.log(data, '220');
      const url = 'user-ad/';
      const config = {
        headers: {
          ' Authorization': `Bearer ${token}`,
        },
      };
      // console.log('221');
      const resp = await http.post(url, data, config);
      return resp;
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  const submitAdDataHandler = async () => {
    try {
      // const imagesPromise = images.map(item => uploadImage(item));
      // const responseImages = await Promise.all(imagesPromise);

      // images.forEach(image => await uploadImage());
      let uploadedImgArr = [];
      for (const image of images) {
        let resp = await uploadImage(image);
        uploadedImgArr.push(resp);
      }

      console.log(uploadedImgArr, '245');

      const adCreatedData = await createAdHandler(uploadedImgArr);
      console.log(adCreatedData, '253');

      let answerArr = AdData.answers;
      let respArr = [];
      const userid = await AsyncStorage.getItem('userID');
      for (const answer of answerArr) {
        let resp = await uploadAnswer(answer, userid, adCreatedData.id);
        respArr.push(resp);
      }
      console.log(respArr);
      navigation.navigate('Home', {});
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const uploadAnswer = async (answer, userid, adID) => {
    try {
      console.log('inside answer upload 268');
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
      console.log(data, '286');
      const resp = await http.post(url, data, config);
      return resp;
    } catch (error) {
      console.log(JSON.stringify(error));
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
            console.log(x, (x / width).toFixed(0), 'line 84');
            setCurrentIndex((x / width).toFixed(0));
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          renderItem={({item, index}) => {
            return (
              <View>
                <Image
                  source={{uri: item.uri}}
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
            <Text style={{color: '#222'}}>
              {parseInt(currentIndex) + 1}/{images.length}
            </Text>
          </View>
        ) : (
          ''
        )}
      </View>
      <View style={styles.cardButtonSection}>
        <Text style={{color: '#222', textAlign: 'center', fontWeight: 500}}>
          * Select only {MAX_IMAGE_ALLOWED} images to Upload.
        </Text>
        {maxImageExceed
          ? Alert.alert(
              `* Please Select upto ${MAX_IMAGE_ALLOWED} images only.`,
            )
          : ''}

        <View style={{flex: 1, flexDirection: 'row', marginTop: '3%'}}>
          {buttonView('Camera', 'camera', openCamera)}
          {buttonView('Gallery', 'folder-open', openGallery)}
        </View>
        <CustomButton
          btnTitle="Publish Ad"
          onpress={() => submitAdDataHandler()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  wrapper: {width: width, height: height * 0.3},
  removeImageBtn: {position: 'absolute', right: 30, top: 10},
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
  cardButtonSection: {
    flex: 1,
    padding: '2%',
  },
});
