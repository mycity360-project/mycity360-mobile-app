import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';

export default function ModalView({title, data, visible, onSelect, onClose}) {
  console.log(data, visible, onSelect);
  const handleSelect = value => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                borderBottomColor: '#FA8C00',
                borderBottomWidth: 1,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#222',
                  alignSelf: 'center',
                  padding: 4,
                }}>
                {title}
              </Text>
            </View>

            <FlatList
              data={data}
              keyExtractor={item => item.key}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={styles.itemList}>
                  <Text style={{fontSize: 16}}>{item.value}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => onClose()}
              style={{alignItems: 'flex-end', padding: 10}}>
              <Button
                title="Cancel"
                color="#FA8C00"
                style={{color: '#222', fontWeight: 500}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    padding: 5,
    height: '35%',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '75%',
    elevation: 5,
  },
  itemList: {
    width: '90%',
    height: 35,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
