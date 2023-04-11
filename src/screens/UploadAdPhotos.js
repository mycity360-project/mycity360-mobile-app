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
} from 'react-native';
import React, {useState, useRef} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '../shared/components/CustomButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SwipeImage from '../shared/components/SwipeImage';
import {MAX_IMAGE_ALLOWED} from '../shared/constants/env';
const {width, height} = Dimensions.get('window');

export default function UploadAdPhotos() {
  let [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(Number(0));
  const [maxImageExceed, setMaxImageExceed] = useState(false);
  const [id, setId] = useState(1);
  const ref = useRef();

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
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {id: id, uri: {uri: response.assets[0].uri}};
        const updatedImages = images;
        updatedImages.push(source);
        setImages(updatedImages);
        setId(id + 1);
      }
    });
  };
  const openGallery = () => {
    const options = {
      storageOptions: {path: 'images', mediaType: 'photo'},
      selectionLimit: 0,
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
          const source = {id: id, uri: {uri: response.assets[0].uri}};
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
            const source = {id: count, uri: {uri: item.uri}};
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
                  source={item.uri}
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
      </View>
      <View style={styles.cardButtonSection}>
        {maxImageExceed ? (
          <Text style={{color: 'red'}}>
            Number of Image Execeeded {MAX_IMAGE_ALLOWED}. Please Select only
            {MAX_IMAGE_ALLOWED} Images.
          </Text>
        ) : (
          ''
        )}
        <CustomButton
          btnTitle="Open Camera"
          onpress={() => {
            openCamera();
          }}
        />
        <CustomButton
          btnTitle="Gallery"
          onpress={() => {
            openGallery();
          }}
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
});
