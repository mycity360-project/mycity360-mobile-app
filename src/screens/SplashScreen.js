import React from 'react';
import {View, ImageBackground, StyleSheet, Dimensions} from 'react-native';

const SplashScreen = () => {
  const {width, height} = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/splash.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: '90%',
    height: '100%',
  },
});

export default SplashScreen;
