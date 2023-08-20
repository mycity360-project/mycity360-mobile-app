/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Linking,
  Platform,
  SafeAreaView,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import React, {useState, useContext} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';
import {AuthContext} from '../context/AuthContext';

const {width, height} = Dimensions.get('window');

export default function ServiceDescription({route, navigation}) {
  const {serviceDetails} = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const {logout, userInfo} = useContext(AuthContext);
  const openDialer = phoneNumber => {
    Platform.OS === 'ios'
      ? Linking.openURL(`telprompt:${phoneNumber}`)
      : Linking.openURL(`tel:${phoneNumber}`);
  };
  const renderEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../assets/images/noimage.png')}
        style={styles.wrapper}
        resizeMode="cover"
      />
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.adHeaderSection}>
        <View style={styles.adImgSection}>
          <FlatList
            data={serviceDetails.images}
            keyExtractor={item => item.id}
            onScroll={event => {
              const x = event.nativeEvent.contentOffset.x;
              setCurrentIndex((x / width).toFixed(0));
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            ListEmptyComponent={renderEmptyComponent}
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
            {serviceDetails.images?.map((e, index) => {
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
          <View style={styles.infoSectionTop}>
            <Text allowFontScaling={false} style={styles.title}>
              {serviceDetails.title}
            </Text>
            <Text allowFontScaling={false} style={styles.adID}>
              Service ID: {serviceDetails.code}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.adDescriptionSection}
        contentContainerStyle={{padding: 10}}>
        <Text
          allowFontScaling={false}
          style={{fontSize: 16, fontWeight: 600, color: '#111'}}>
          Description
        </Text>
        <Text allowFontScaling={false} style={{color: '#111'}}>
          {serviceDetails.description}
        </Text>
      </ScrollView>

      <View style={styles.footer}>
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
              openDialer(serviceDetails.phone);
            }
          }}>
          <Text allowFontScaling={false} style={styles.buttonText}>
            Call Now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  adHeaderSection: {flex: 0.8},
  adImgSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adInfoSection: {
    flex: 0.15,
    padding: 5,
    marginTop: '1%',
    backgroundColor: '#FFF',
  },
  infoSectionTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {flex: 1, fontSize: 16, fontWeight: 500, color: '#111'},
  adID: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    fontWeight: 500,
    textAlign: 'right',
  },

  adDescriptionSection: {
    flex: 5,
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
