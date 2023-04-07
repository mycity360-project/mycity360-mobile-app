import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  ImagePicker,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import CustomButton from '../shared/components/CustomButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

export default function UploadAdPhotos() {
  let [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshFlatlist, setRefreshFlatList] = useState(false);

  // console.log(images, currentIndex, 'rerender');
  // useEffect(() => {}, [images]);
  const removeFromArray = index => {
    // const imagesUpdated = images.filter(uri => {
    //   return uri !== uriToRemove;
    // });

    const imagesUpdated = images
      .slice(0, index)
      .concat(images.slice(index + 1));
    // console.log(imagesUpdated, index, 'imgs updated');
    setImages(imagesUpdated);
    setCurrentIndex(index - 1);
    setRefreshFlatList(!refreshFlatlist);
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
        const source = {uri: response.assets[0].uri};
        const updatedImages = images;
        updatedImages.push(source);
        setImages(updatedImages);
        // console.log(updatedImages, '59 line');
        setRefreshFlatList(!refreshFlatlist);
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
          onScroll={event => {
            const x = event.nativeEvent.contentOffset.x;
            console.log(x, (x / width).toFixed(0), 'line 84');
            setCurrentIndex((x / width).toFixed(0));
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          renderItem={({item, index}) => {
            // console.log(item.item, 'flatlist wala');
            return (
              <View>
                <Image
                  key={index}
                  source={item}
                  resizeMode="contain"
                  style={styles.wrapper}
                />
                <TouchableOpacity
                  // key={index + 1}
                  style={styles.removeImageBtn}
                  onPress={() => removeFromArray(index)}>
                  <MaterialIcon name="close" color={'#222'} size={28} />
                </TouchableOpacity>
              </View>
            );
          }}
          extraData={refreshFlatlist}
        />

        {/* <ScrollView
          onScroll={event => {
            const x = event.nativeEvent.contentOffset.x;
            console.log(x, x / width);
            setCurrentIndex((x / width).toFixed(0));
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}>
          {images.map((uri, index) => {
            return (
              <View>
                <Image
                  key={index}
                  source={uri}
                  resizeMode="contain"
                  style={styles.wrapper}
                />
                <TouchableOpacity
                  key={index + 1}
                  style={styles.removeImageBtn}
                  onPress={() => removeFromArray(uri)}>
                  <MaterialIcon name="close" color={'#222'} size={28} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView> */}
        <View style={styles.dotWrapper}>
          {images.map((e, index) => {
            return (
              <View
                key={index}
                style={[
                  styles.dotCommon,
                  currentIndex == index
                    ? styles.dotActive
                    : styles.dotNotActive,
                ]}></View>
            );
          })}
        </View>
      </View>
      <View style={styles.cardButtonSection}>
        <CustomButton
          btnTitle="Open Camera"
          onpress={() => {
            openCamera();
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
  dotCommon: {width: 8, height: 8, borderRadius: 4, marginLeft: 4},
  dotActive: {
    backgroundColor: '#FA8C00',
  },
  dotNotActive: {
    backgroundColor: '#fff',
  },
});
