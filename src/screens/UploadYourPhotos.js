import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {
  ImagePicker,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import CustomButton from '../shared/components/CustomButton';
import style from '../shared/constants/style';

export default function UploadYourPhotos() {
  let [imageUri, setImageUri] = useState([]);

  const removeFromArray = item =>
    imageUri.filter(function (uri) {
      console.log(item);
      return uri !== item;
    });

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
        setImageUri(imageUri => [...imageUri, source]);
      }
    });
  };
  return (
    <SafeAreaView>
      <CustomButton
        btnTitle="Open Camera"
        onpress={() => {
          openCamera();
        }}
      />

      {imageUri
        ? imageUri.map(item => {
            return (
              <View>
                <Image source={item} style={{width: 200, height: 200}} />
                <TouchableOpacity onPress={() => removeFromArray(item)}>
                  <Text>remove</Text>
                </TouchableOpacity>
              </View>
            );
          })
        : ''}
    </SafeAreaView>
  );
}
