import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import React, {forwardRef, useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from './CustomButton';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');

const SwipeImage = React.forwardRef((props, ref) => {
  const {
    data,
    isFromAdDescription,
    isFromUploadAdPhotos,
    removeFromArray,
    currentIndexSet,
    onPress,
  } = props;
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const removeButton = (
    <TouchableOpacity
      style={styles.removeImageBtn}
      onPress={() => removeFromArray(item.id)}>
      <MaterialIcon name="close" color={'#222'} size={28} />
    </TouchableOpacity>
  );
  return (
    <View
      style={[
        styles.wrapper,
        {
          borderBottomColor: '#999',
          borderBottomWidth: 1,
          backgroundColor: '#e0e0e0',
        },
      ]}>
      <View
        style={{
          position: 'absolute',
          top: 5,
          left: 10,
        }}>
        <CustomButton btnType="backAd" onpress={onPress} />
      </View>

      <FlatList
        data={data}
        ref={ref}
        keyExtractor={item => item.id}
        onScroll={event => {
          const x = event.nativeEvent.contentOffset.x;
          const index = (x / width).toFixed(0);
          setCurrentIndex(index);
          () => currentIndexSet(index);
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        renderItem={({item, index}) => {
          return (
            <View>
              <Image
                source={item.uri}
                resizeMode="contain"
                style={styles.wrapper}
              />
              {isFromUploadAdPhotos ? removeButton : ''}
            </View>
          );
        }}
      />

      <View style={styles.dotWrapper}>
        {data.map((e, index) => {
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
    </View>
  );
});

export default SwipeImage;

const styles = StyleSheet.create({
  wrapper: {width: width, height: height * 0.3},
  removeImageBtn: {position: 'absolute', right: 30, top: 10},
  dotWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
  },
  dotCommon: {width: 12, height: 12, borderRadius: 6, marginLeft: 5},
  dotActive: {
    backgroundColor: '#FA8C00',
  },
  dotNotActive: {
    backgroundColor: '#fff',
  },
});
