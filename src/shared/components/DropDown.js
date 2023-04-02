import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {React, useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function DropDown(props) {
  const {placeholder, locationArray, setLocation} = props;
  const [selected, setSelected] = useState(`${placeholder}`);
  const [isClicked, setIsClicked] = useState(false);
  const [data, setData] = useState(locationArray);
  const onSearch = txt => {
    if (txt !== '') {
      let tempData = data.filter(item => {
        return item.toLowerCase().indexOf(txt.toLowerCase()) > -1;
      });
      setData(tempData);
    } else {
      setData(locationArray);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownSelector}
        onPress={() => {
          setIsClicked(!isClicked);
        }}>
        <Text style={{color: '#222'}}>{selected}</Text>
        {isClicked ? (
          <MaterialIcon name="arrow-drop-up" size={25} color={'#222'} />
        ) : (
          <MaterialIcon name="arrow-drop-down" size={25} color={'#222'} />
        )}
      </TouchableOpacity>
      {isClicked ? (
        <View style={styles.dropdownArea}>
          <TextInput
            placeholder="Search"
            onChangeText={txt => {
              onSearch(txt);
            }}
            style={styles.searchInput}
          />
          <FlatList
            data={data}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={styles.itemList}
                  onPress={() => {
                    setSelected(item.value);
                    setLocation(item);
                    onSearch('');
                    setIsClicked(false);
                  }}>
                  <Text>{item.value}</Text>
                </TouchableOpacity>
              );
            }}
            extraData={data}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: -1,
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '76%',
    marginTop: '3%',
    marginHorizontal: '12%',
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    padding: 10,
    elevation: 5, //Android Only
    shadowRadius: 5, // IOS Only
  },
  dropdownArea: {
    width: '75%',
    height: 120,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#EFEFEF',
    alignSelf: 'center',
    marginTop: 1,
    elevation: 5,
  },
  searchInput: {
    width: '90%',
    backgroundColor: '#fafafa',
    alignSelf: 'center',
    marginTop: '2%',
    borderRadius: 20,
    padding: 10,
  },
  itemList: {
    width: '80%',
    height: 35,
    borderBottomColor: '#222',
    borderBottomWidth: 0.5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
