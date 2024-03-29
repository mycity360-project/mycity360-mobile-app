import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import DropDown from '../shared/components/DropDown';
import {http} from '../shared/lib';
import {StackActions} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../shared/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';

export default function Location({navigation}) {
  const closeSellScreen = StackActions.pop(1); //close screen on click of close btn
  const [locationData, setLocationData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [showLocationError, setShowLocationError] = useState(false);
  const [showAreaError, setShowAreaError] = useState(false);
  const {userInfo, setUserInfo} = useContext(AuthContext);

  const getLocations = async () => {
    setIsLoading(true);
    try {
      let locationRespdata = await http.get('location/public/?isactive=true');

      const locations = locationRespdata.map(location => ({
        key: location.id.toString(),
        value: location.name,
      }));

      setLocationData(locations);
    } catch (error) {
      Alert.alert('ERROR', 'Something went wrong, we are working on it', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  const getAreas = async location => {
    setIsLoading(true);
    try {
      let areaRespData = await http.get(
        `area/public/?location_id=${location.key}`,
      );

      const areas = areaRespData.map(area => ({
        key: area.id.toString(),
        value: area.name,
      }));

      setAreaData(areas);
      setIsDisabled(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('ERROR', 'Something went wrong, we are working on it', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  const setLocation = async location => {
    setSelectedLocation(location);
    setShowLocationError(false);
    await getAreas(location);
  };
  const setArea = async area => {
    setSelectedArea(area);
    setShowAreaError(false);
  };

  const updateLocationHandler = async () => {
    if (selectedLocation === '') {
      setShowLocationError(true);
      return;
    }
    if (selectedArea === '') {
      setShowAreaError(true);
      return;
    }

    const info = await AsyncStorage.getItem('userInfo');
    let user = JSON.parse(info);
    user = {
      ...user,
      localUserArea: {id: selectedArea.key, name: selectedArea.value},
    };
    await AsyncStorage.setItem('userInfo', JSON.stringify(user));
    setUserInfo({
      ...user,
      localUserArea: {id: selectedArea.key, name: selectedArea.value},
    });
    navigation.popToTop();
  };
  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={'#FA8C00'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(closeSellScreen);
          }}>
          <MaterialIcon name="close" color={'#444'} size={32} />
        </TouchableOpacity>

        <Text allowFontScaling={false} style={styles.headingText}>
          Set District
        </Text>
      </View>
      <View style={{flex: 9}}>
        <DropDown
          placeholder="Select District"
          dataArray={locationData}
          selectedDataHandler={location => setLocation(location)}
          isDisabled={false}
          selectedValue={selectedLocation}
        />
        {showLocationError && (
          <Text allowFontScaling={false} style={styles.error}>
            Please Select District
          </Text>
        )}
        <DropDown
          placeholder="Select Area"
          dataArray={areaData}
          isDisabled={isDisabled}
          selectedDataHandler={area => setArea(area)}
          selectedValue={selectedArea}
        />
        {showAreaError ? (
          <Text allowFontScaling={false} style={styles.error}>
            Please Select Area
          </Text>
        ) : (
          ''
        )}
        <CustomButton
          btnTitle="Update"
          onpress={() => updateLocationHandler()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flex: 0.6,
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 15,
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    gap: 20,
  },
  headingText: {fontSize: 18, color: '#111'},
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
