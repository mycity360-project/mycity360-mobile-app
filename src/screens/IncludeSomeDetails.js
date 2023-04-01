import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../shared/components/CustomButton';
import {useNavigation} from '@react-navigation/native';

export default function IncludeSomeDetails({navigation: {goBack}}) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}>
          <MaterialIcon name="arrow-back" color={'#111'} size={28} />
        </TouchableOpacity>

        <Text style={styles.headingText}>Include Some Details</Text>
      </View>
      <View style={styles.detailsFormSection}>
        <TextInput style={styles.inputField} placeholder="Brand Name *" />
        <TextInput style={styles.inputField} placeholder="Ad Title *" />
        <TextInput
          multiline={true}
          style={styles.inputField}
          placeholder="Describe your product *"
        />
        <Text
          style={{
            fontSize: 12,
            color: '#444',
            marginTop: -30,
            marginLeft: '85%',
          }}>
          (0/3000)
        </Text>
      </View>
      <View
        style={{flex: 1.5, justifyContent: 'center', alignContent: 'center'}}>
        <CustomButton
          btnTitle="Next"
          onpress={() => navigation.navigate('UploadYourPhotos')}
          style={{width: '90%', marginHorizontal: '5%'}}
        />
      </View>
    </View>
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
});
