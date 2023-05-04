import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../shared/components/CustomButton';
import {AD_DESC_MAX_LENGTH} from '../shared/constants/env';

export default function IncludeSomeDetails({navigation, route}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [descLength, setDescLength] = useState(Number(0));
  const [isTitleError, setIsTitleError] = useState(false);
  const [isDescError, setIsDescError] = useState(false);
  const [price, setPrice] = useState('');
  const [isPriceError, setIsPriceError] = useState(false);
  const [isPriceZero, setIsPriceZero] = useState(false);
  // const [adDescription, setAdDescription] = useState('');
  // const [adDescriptionError, setAdDescriptionError] = useState('');

  const errors = {
    title: 'Title is Required',
    description: 'Description is Required',
    price: 'Price is Required',
    priceZero: 'Price Cannot be 0',
  };
  const onNextHandler = () => {
    if (title.length == Number(0)) {
      setIsTitleError(true);
      return;
    } else if (description.length == Number(0)) {
      setIsTitleError(false);
      setIsDescError(true);
      return;
    } else if (price.length == Number(0)) {
      setIsDescError(false);
      setIsPriceError(true);
      return;
    } else if (!Number(price)) {
      setIsPriceError(false);
      setIsPriceZero(true);
    } else {
      setIsPriceZero(false);
      navigation.navigate('UploadAdPhotos', {
        AdData: {
          title: title,
          description: description,
          price: Number(price),
          ...route.params?.AdData,
        },
      });
    }
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcon name="arrow-back" color={'#111'} size={28} />
        </TouchableOpacity>

        <Text style={styles.headingText}>Include Some Details</Text>
      </View>
      <View style={styles.detailsFormSection}>
        <View style={{flex: 0.2}}>
          <Text style={{fontSize: 16, fontWeight: 500, color: '#222'}}>
            Title
          </Text>
          <TextInput
            placeholder="Enter Title"
            autoFocus={true}
            value={title}
            onChangeText={title => {
              setTitle(title);
            }}
            style={{borderBottomWidth: 1, padding: 1, marginBottom: 20}}
          />
        </View>
        {isTitleError ? <Text style={styles.error}>{errors.title}</Text> : ''}
        <View style={{flex: 0.3, marginBottom: '8%'}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: '#222',
            }}>
            Description
          </Text>
          <TextInput
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
        {isDescError && <Text style={styles.error}>{errors.description}</Text>}

        {/* <View style={{flex: 0.1, flexDirection: 'row'}}>
          <Text style={{color: 'red'}}>{adDescriptionError}</Text>

          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            {AD_DESC_MAX_LENGTH - descLength <= 30 ? (
              <Text style={{color: 'red'}}>
                {descLength}/{AD_DESC_MAX_LENGTH}
              </Text>
            ) : (
              <Text>
                {descLength}/{AD_DESC_MAX_LENGTH}
              </Text>
            )}
          </View>
        </View> */}
        {/* <View style={{flex: 1}}>
          <Text style={{fontSize: 16, fontWeight: 500, color: '#222'}}>
            Price
          </Text>
          <TextInput
            placeholder="Enter Price"
            keyboardType="numeric"
            value={price}
            onChangeText={price => {
              setPrice(price);
            }}
            style={{borderBottomWidth: 1, padding: 1}}
          />
          {isPriceError ? <Text style={styles.error}>{errors.price}</Text> : ''}
          {isPriceZero ? (
            <Text style={styles.error}>{errors.priceZero}</Text>
          ) : (
            ''
          )}
        </View> */}

        <View style={{flex: 1}}>
          <Text style={{fontSize: 16, fontWeight: 500, color: '#222'}}>
            Price
          </Text>
          <TextInput
            placeholder="Enter Price"
            keyboardType="numeric"
            value={price}
            onChangeText={price => {
              setPrice(price);
            }}
            style={{borderBottomWidth: 1, padding: 1}}
          />
          {isPriceError ? <Text style={styles.error}>{errors.price}</Text> : ''}
          {isPriceZero ? (
            <Text style={styles.error}>{errors.priceZero}</Text>
          ) : (
            ''
          )}
        </View>
      </View>
      <View
        style={{flex: 1.5, justifyContent: 'center', alignContent: 'center'}}>
        <CustomButton
          btnTitle="Next"
          onpress={() => onNextHandler()}
          style={{width: '90%', marginHorizontal: '5%'}}
        />
      </View>
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
