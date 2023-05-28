import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../shared/components/CustomButton';
import {AD_DESC_MAX_LENGTH} from '../shared/constants/env';

export default function IncludeSomeDetails({navigation, route}) {
  const {AdData, isPrice} = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [descLength, setDescLength] = useState(Number(0));
  const [isTitleError, setIsTitleError] = useState(false);
  const [isDescError, setIsDescError] = useState(false);
  const [price, setPrice] = useState('');
  const [isPriceError, setIsPriceError] = useState(false);
  const [isPriceRangeError, setIsPriceRangeError] = useState(false);
  // const [adDescription, setAdDescription] = useState('');
  // const [adDescriptionError, setAdDescriptionError] = useState('');

  const errors = {
    title: 'Title is Required',
    description: 'Description is Required',
    price: 'Price is Required',
    priceZero: 'Price must be in range of 0 to 100 Cr.',
  };

  const onNextHandler = () => {
    if (parseInt(title.length) === Number(0)) {
      setIsTitleError(true);
      return;
    }
    if (parseInt(description.length) === Number(0)) {
      setIsTitleError(false);
      setIsDescError(true);
      return;
    }
    if (isPrice) {
      if (parseInt(price.length) === Number(0)) {
        setIsDescError(false);
        setIsPriceError(true);
        return;
      }
      if (!Number(price) || Number(price) >= Number(1000000000)) {
        setIsPriceError(false);
        setIsPriceRangeError(true);
        return;
      }
    }
    setIsDescError(false);
    setIsPriceError(false);
    setIsPriceRangeError(false);
    navigation.navigate('UploadAdPhotos', {
      AdData: {
        ...AdData,
        title: title,
        description: description,
        ...(isPrice && {price: Number(price)}),
      },
    });
  };

  // const handleDescChange = desc => {
  //   const len = desc.length;
  //   if (len > AD_DESC_MAX_LENGTH) {
  //     setAdDescription(adDescription); // Reset to previous value if maxLength is exceeded
  //     setAdDescriptionError(
  //       `Ad description cannot exceed ${AD_DESC_MAX_LENGTH} characters`,
  //     );
  //   } else {
  //     setAdDescription(desc);
  //     setAdDescriptionError('');
  //   }
  //   setDescLength(len);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <MaterialIcon name="arrow-back" color={'#111'} size={28} />
            </TouchableOpacity>

            <Text allowFontScaling={false} style={styles.headingText}>
              Include Some Details
            </Text>
          </View>
          <View style={styles.detailsFormSection}>
            <View style={{flex: 0.2}}>
              <Text
                allowFontScaling={false}
                style={{fontSize: 16, fontWeight: 500, color: '#222'}}>
                Title
              </Text>
              <TextInput
                allowFontScaling={false}
                placeholder="Enter Title"
                autoFocus={true}
                value={title}
                onChangeText={title => {
                  setTitle(title);
                }}
                style={{borderBottomWidth: 1, padding: 1, marginBottom: 20}}
              />
            </View>
            {isTitleError ? (
              <Text allowFontScaling={false} style={styles.error}>
                {errors.title}
              </Text>
            ) : (
              ''
            )}
            <View style={{flex: 0.3, marginBottom: '8%'}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: '#222',
                }}>
                Description
              </Text>
              <TextInput
                allowFontScaling={false}
                placeholder="Describe your product."
                multiline={true}
                // maxLength={AD_DESC_MAX_LENGTH}
                numberOfLines={5}
                value={description}
                onChangeText={desc => {
                  setDescription(desc);
                }}
                style={{
                  borderWidth: 0.5,
                  textAlignVertical: 'top',
                  marginTop: '1%',
                }}
              />
            </View>
            {isDescError && (
              <Text allowFontScaling={false} style={styles.error}>
                {errors.description}
              </Text>
            )}

            {/* <View style={{flex: 0.1, flexDirection: 'row'}}>
          <Text allowFontScaling={false} style={{color: 'red'}}>{adDescriptionError}</Text>

          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            {AD_DESC_MAX_LENGTH - descLength <= 30 ? (
              <Text allowFontScaling={false} style={{color: 'red'}}>
                {descLength}/{AD_DESC_MAX_LENGTH}
              </Text>
            ) : (
              <Text allowFontScaling={false}>
                {descLength}/{AD_DESC_MAX_LENGTH}
              </Text>
            )}
          </View>
        </View> */}

            {isPrice && (
              <View style={{flex: 1}}>
                <Text
                  allowFontScaling={false}
                  style={{fontSize: 16, fontWeight: 500, color: '#222'}}>
                  Price
                </Text>
                <TextInput
                  allowFontScaling={false}
                  placeholder="Enter Price"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={price => {
                    setPrice(price);
                  }}
                  style={{borderBottomWidth: 1, padding: 1}}
                />
                {isPriceError && (
                  <Text allowFontScaling={false} style={styles.error}>
                    {errors.price}
                  </Text>
                )}
                {isPriceRangeError && (
                  <Text allowFontScaling={false} style={styles.error}>
                    {errors.priceZero}
                  </Text>
                )}
              </View>
            )}
          </View>
          <View
            style={{
              flex: 1.5,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <CustomButton
              btnTitle="Next"
              onpress={() => onNextHandler()}
              style={{width: '90%', marginHorizontal: '5%'}}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 0.8,
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 15,
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    gap: 20,
  },
  headingText: {fontSize: 18, color: '#111'},
  detailsFormSection: {flex: 10, padding: 20, alignContent: 'center'},
  inputField: {
    borderBottomColor: '#777',
    borderBottomWidth: 1,
    padding: 1,
    marginBottom: 30,
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
