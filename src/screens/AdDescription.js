/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Linking,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {http} from '../shared/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';
const {width, height} = Dimensions.get('window');

export default function AdDescription({route, navigation}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerData, setAnswerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {adDetails} = route.params;
  const {location, area} = adDetails;

  const openDialer = contactNumber => {
    Platform.OS === 'ios'
      ? Linking.openURL(`telprompt:${contactNumber}`)
      : Linking.openURL(`tel:${contactNumber}`);
  };

  const deleteAdHandler = async () => {
    try {
      setIsLoading(true);
      const url = `/user-ad/${adDetails.id}/`;
      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await http.delete(url, config);
      setIsLoading(false);

      navigation.navigate('YourAds', {
        showAlert: true,
        alertHeading: 'SUCCESS',
        alertMsg: 'Ad Deleted Successfully.',
        btnText: 'OK',
      });
    } catch (error) {
      Alert.alert('ERROR', 'Something Went Wrong', [{text: 'OK'}]);
    }
  };

  const getAnswers = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const answersRespData = await http.get(
        `answer/?user_ad_id=${adDetails.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(answersRespData, '71');
      const answers = answersRespData.results.map(answer => ({
        question: answer.question.label,
        answer: answer.answer,
      }));
      setAnswerData(answers);
    } catch (err) {
      Alert.alert('ERROR', 'Something Went Wrong', [{text: 'OK'}]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnswers();
  }, []);

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.adHeaderSection}>
        <View style={styles.adImgSection}>
          <FlatList
            data={adDetails.images}
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
                <Image
                  source={{uri: item.image}}
                  resizeMode="contain"
                  style={styles.wrapper}
                />
              );
            }}
          />

          <View style={styles.dotWrapper}>
            {adDetails.images.map((e, index) => {
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
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 10,
              left: 15,
            }}
            onPress={() => {
              navigation.goBack();
            }}>
            <MaterialIcon name="arrow-back" size={24} color={'#222'} />
          </TouchableOpacity>
        </View>
        <View style={styles.adInfoSection}>
          {adDetails.isPrice && (
            <View style={styles.infoSectionTop}>
              <Text style={styles.priceText}>₹ {adDetails.price}</Text>
            </View>
          )}

          <Text style={styles.infoSectionMiddle}>{adDetails.title}</Text>
          <View style={styles.infoSectionBottom}>
            <View style={styles.locationSection}>
              <MaterialIcon name="location-pin" size={18} color={'#444'} />
              <Text style={styles.locationText}>
                {location === area ? location : `${area} , ${location}`}
              </Text>
            </View>
            <Text style={styles.dateAdded}>
              {Moment(adDetails.createdOn).format('DD MMM YYYY')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.adDescriptionSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Description
        </Text>
        <Text style={{color: '#111'}}>{adDetails.description}</Text>
      </View>

      <View style={styles.adQuesAnsSection}>
        <Text style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Details
        </Text>
        <View>
          <FlatList
            data={answerData}
            numColumns={2}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 2,
                    width: '45%',
                    padding: 2,
                  }}>
                  <Text style={{color: '#222', fontWeight: 500, fontSize: 12}}>
                    {item.question} -
                  </Text>
                  <Text style={{color: '#111', fontSize: 12}}>
                    {item.answer}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </View>

      <View style={styles.otherDetailsSection}>
        <Text style={styles.otherDetailsText}>Ad ID: {adDetails.id}</Text>
      </View>

      <View style={styles.footer}>
        {adDetails.showCallNowBtn && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => openDialer(adDetails.phone)}>
            <Text style={styles.buttonText}>Call Now</Text>
          </TouchableOpacity>
        )}
        {adDetails.showDeleteBtn && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Alert.alert('Warning', 'Are you sure, you want to delete ?', [
                {text: 'OK', onPress: () => deleteAdHandler()},
                {text: 'Cancel'},
              ]);
            }}>
            <Text style={styles.buttonText}>Delete Ad</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  adHeaderSection: {flex: 3, paddingTop: 5},
  adImgSection: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adInfoSection: {
    flex: 0.5,
    padding: 5,
    marginTop: '2%',
    backgroundColor: '#FFF',
  },
  infoSectionTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {fontSize: 20, fontWeight: 600, color: '#111'},
  infoSectionMiddle: {
    flex: 1,
    fontSize: 16,
    width: '90%',
    color: '#000',
  },
  infoSectionBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  locationSection: {flexDirection: 'row'},
  locationText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#444',
  },
  dateAdded: {
    fontSize: 14,
    fontWeight: 500,
    color: '#444',
  },
  adDescriptionSection: {
    flex: 1,
    padding: 5,
    marginTop: '2%',
    backgroundColor: '#FFF',
  },
  adQuesAnsSection: {
    flex: 2,
    padding: 5,
    marginTop: '2%',
    backgroundColor: '#FFF',
  },
  otherDetailsSection: {
    flex: 0.3,
    justifyContent: 'center',
    padding: 5,
    marginTop: '2%',
    backgroundColor: '#FFF',
  },
  otherDetailsText: {fontSize: 14, color: '#111', fontWeight: 500},
  footer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#FA8C00',
    width: '70%',
    height: '60%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#111',
    fontWeight: 500,
  },

  wrapper: {width: width, height: height * 0.3},

  dotWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
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
});
