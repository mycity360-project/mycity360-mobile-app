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
  Pressable,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {http} from '../shared/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';
import {AuthContext} from '../context/AuthContext';
import ImageView from 'react-native-image-viewing';
import {SUPPORT_EMAIL} from '../shared/constants/env';
const {width, height} = Dimensions.get('window');

export default function AdDescription({route, navigation}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerData, setAnswerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuesAnsAvailable, setIsQuesAnsAvailable] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageViewIndex, setImageViewIndex] = useState(0);
  const [imageViewData, setImageViewData] = useState([]);
  const {logout, userInfo} = useContext(AuthContext);
  const {adDetails} = route.params;
  const {location, area} = adDetails;
  console.log(userInfo, 'dsdasadasdasdasdasdasdasd');

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

      Alert.alert('SUCCESS', 'Ad Deleted Successfully.', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('YourAds', {
              alertHeading: 'SUCCESS',
              alertMsg: 'Ad Deleted Successfully.',
              btnText: 'OK',
            }),
        },
      ]);
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      } else {
        Alert.alert('ERROR', 'Something Went Wrong', [{text: 'OK'}]);
      }
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

      const answers = answersRespData.results.map(answer => ({
        question: answer.question.label,
        answer: answer.answer,
      }));

      setAnswerData(answers);
      setIsQuesAnsAvailable(answers.length ? true : false);
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      } else {
        Alert.alert('ERROR', 'Something Went Wrong in getting Description', [
          {text: 'OK'},
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnswers();
  }, []);

  const renderHeader = () => {
    return (
      <>
        <View>
          <Text
            allowFontScaling={false}
            style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
            Description
          </Text>
          <Text allowFontScaling={false} style={{color: '#111'}}>
            {adDetails.description}
          </Text>
        </View>
        {isQuesAnsAvailable && (
          <Text
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#111',
              marginTop: 10,
            }}>
            Details
          </Text>
        )}
      </>
    );
  };

  const imageViewHandler = index => {
    const imagesData = adDetails.images.map(item => {
      return {
        uri: item.image,
      };
    });
    setImageViewData(imagesData);
    setImageViewIndex(index);
    setShowImageViewer(true);
  };
  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={'#FA8C00'} />
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
                <Pressable
                  onPress={() => {
                    imageViewHandler(index);
                  }}>
                  <Image
                    source={{uri: item.image}}
                    resizeMode="contain"
                    style={styles.wrapper}
                  />
                </Pressable>
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
                    parseInt(currentIndex, 10) === index
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
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 10,
              right: 15,
            }}
            onPress={() => {
              if (
                userInfo.id !== adDetails.userID &&
                userInfo.role !== 'Guest'
              ) {
                const subject = `I want to report this post with Ad Id ${adDetails.code}`;
                const body = `Hi Support,\n I am ${
                  userInfo.first_name + userInfo.last_name
                } and I want to report this add.\n Regards,\n ${
                  userInfo.first_name
                }`;
                Linking.openURL(
                  `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`,
                );
              } else {
                if (userInfo.role === 'Guest') {
                  Alert.alert(
                    'Warning',
                    'To Access these feature please signup and login in app',
                    [
                      {text: 'Cancel'},
                      {text: 'Login', onPress: () => logout()},
                    ],
                  );
                } else {
                  Alert.alert(
                    'Warning',
                    "You're not allowed to report own add",
                    [{text: 'OK'}],
                  );
                }
              }
            }}>
            <MaterialIcon name="flag" size={24} color={'#FF0000'} />
          </TouchableOpacity>
        </View>
        {showImageViewer && (
          <ImageView
            images={imageViewData}
            imageIndex={imageViewIndex}
            visible={showImageViewer}
            onRequestClose={() => setShowImageViewer(false)}
          />
        )}
        <View style={styles.adInfoSection}>
          <View style={styles.infoSectionTop}>
            {adDetails.isPrice && (
              <Text allowFontScaling={false} style={styles.priceText}>
                ₹ {adDetails.price}
              </Text>
            )}
            <Text
              allowFontScaling={false}
              style={[
                styles.adID,
                {textAlign: adDetails.isPrice ? 'right' : 'left'},
              ]}>
              Ad ID: {adDetails.code}
            </Text>
          </View>

          <Text allowFontScaling={false} style={styles.infoSectionMiddle}>
            {adDetails.title}
          </Text>
          <View style={styles.infoSectionBottom}>
            <View style={styles.locationSection}>
              <MaterialIcon name="location-pin" size={18} color={'#444'} />
              <Text allowFontScaling={false} style={styles.locationText}>
                {location === area ? location : `${area} , ${location}`}
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.dateAdded}>
              {Moment(adDetails.createdOn).format('DD MMM YYYY')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.descAndDetailSection}>
        <FlatList
          ListHeaderComponent={renderHeader}
          data={[{id: 'column1'}, {id: 'column2'}]}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={{flex: 1}}>
              <FlatList
                data={
                  item.id === 'column1'
                    ? answerData.slice(0, Math.ceil(answerData.length / 2))
                    : answerData.slice(Math.ceil(answerData.length / 2))
                }
                renderItem={({item}) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 2,
                      width: '100%',
                      padding: 2,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{color: '#222', fontWeight: 900, fontSize: 12}}>
                      {item.question} -
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{color: '#111', fontSize: 12}}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {item.answer}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
        />
      </View>

      <View style={styles.footer}>
        {adDetails.showCallNowBtn && (
          <TouchableOpacity
            style={
              userInfo.role === 'Guest'
                ? {...styles.button, backgroundColor: '#808080'}
                : styles.button
            }
            onPress={() => {
              if (userInfo.role === 'Guest') {
                Alert.alert(
                  'Warning',
                  'To Access these feature please signup and login in app',
                  [{text: 'Cancel'}, {text: 'Login', onPress: () => logout()}],
                );
              } else {
                openDialer(adDetails.phone);
              }
            }}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              Call Now
            </Text>
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
            <Text allowFontScaling={false} style={styles.buttonText}>
              Delete Ad
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  adHeaderSection: {flex: 1, paddingTop: 5},
  adImgSection: {
    flex: 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adInfoSection: {
    flex: 0.25,
    padding: 5,
    marginTop: '2%',
    backgroundColor: '#FFF',
  },
  infoSectionTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {flex: 1, fontSize: 20, fontWeight: 600, color: '#111'},
  adID: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    fontWeight: 500,
  },
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
  descAndDetailSection: {
    flex: 1,
    padding: 5,
    marginTop: '2%',
    backgroundColor: '#FFF',
  },

  footer: {
    flex: 0.2,
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
