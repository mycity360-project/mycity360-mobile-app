import React from 'react';
import {View, Text, Modal, StyleSheet, ActivityIndicator} from 'react-native';

const Loader = ({visible, text}) => {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={'#FA8C00'} />
        <Text style={{color: '#222', fontSize: 16}}>{text}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});

export default Loader;
