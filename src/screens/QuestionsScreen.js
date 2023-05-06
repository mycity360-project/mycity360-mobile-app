import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Switch,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../shared/components/CustomButton';
import {http} from '../shared/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalView from '../shared/components/ModalView';

export default function QuestionsScreen({navigation, route}) {
  const {isPrice, ...AdData} = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [answerData, setAnswerData] = useState({});
  const [toggleValue, setToggleValue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedDropdownItemId, setSelectedDropdownItemId] = useState(null);
  const [selectedDropdownItem, setSelectedDropdownItem] = useState('');

  const getQuestions = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const url = `question/user/?category_id=${AdData.subCategoryID}`;
      const questionsRespData = await http.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const questions = questionsRespData.results?.map((question, index) => ({
        id: question?.id?.toString(),
        question: question?.question,
        field: question?.field_type,
        label: question?.label,
        placeholder: question?.placeholder,
        isRequired: question?.is_required,
        answerLimit: question?.answer_limit,
        values: question?.values?.map((item, index) => ({
          key: index.toString(),
          value: item,
        })),
      }));
      console.log(questions, 44);
      setQuestionData(questions);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getQuestions();
    console.log('55');
  }, []);

  const handleAnswer = (id, answer) => {
    console.log(id, answer);
    setAnswerData(prev => ({
      ...prev,
      [id]: answer,
    }));
  };

  const handleDropdownSelection = (id, answer) => {
    setSelectedDropdownItem(answer);
    handleAnswer(id, answer);
  };

  const handleToggle = (id, value) => {
    setToggleValue(value);
    let answer = value ? 'Yes' : 'No';
    handleAnswer(id, answer);
  };

  const renderQuestion = ({item, index}) => {
    return (
      <View>
        {item.field === 'Text' ? (
          <View style={{marginTop: 5}}>
            <Text style={styles.questionText}>{item.question}</Text>
            <TextInput
              placeholder={item.placeholder}
              maxLength={item.answerLimit}
              onChangeText={answer => handleAnswer(item.id, answer)}
              style={{borderBottomWidth: 1, padding: 1}}
            />
          </View>
        ) : item.field === 'Dropdown' ? (
          <View style={{marginTop: 15}}>
            <Text style={styles.questionText}>{item.question}</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedDropdownItemId(item.id);
                setModalVisible(true);
              }}>
              <Text style={{borderBottomWidth: 1, padding: 5}}>
                {answerData[item.id] || item.placeholder}
              </Text>
              {selectedDropdownItemId === item.id && (
                <ModalView
                  title={item.label}
                  visible={modalVisible}
                  data={item.values}
                  onSelect={answer =>
                    handleDropdownSelection(item.id, answer.value)
                  }
                  onClose={() => {
                    setModalVisible(false);
                    setSelectedDropdownItemId(null);
                    setSelectedDropdownItem('');
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        ) : item.field === 'Number' ? (
          <View style={{marginTop: 15}}>
            <Text style={styles.questionText}>{item.question}</Text>
            <TextInput
              placeholder={item.placeholder}
              maxLength={item.answerLimit}
              keyboardType="numeric"
              style={{borderBottomWidth: 1, padding: 1}}
              onChangeText={answer => handleAnswer(item.id, answer)}
            />
          </View>
        ) : item.field === 'Toggle' ? (
          <View
            style={{
              marginTop: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.questionText}>{item.question}</Text>
            <Switch
              value={toggleValue}
              onValueChange={selected => handleToggle(item.id, selected)}
            />
          </View>
        ) : null}
      </View>
    );
  };
  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcon name="arrow-back" color={'#111'} size={28} />
        </TouchableOpacity>

        <Text style={styles.headingText}>Include Some Details</Text>
      </View>
      <View style={styles.detailsFormSection}>
        <FlatList
          data={questionData}
          renderItem={renderQuestion}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <CustomButton
          btnTitle="Next"
          onpress={() => {
            let data = Object.entries(answerData).map(([key, value]) => {
              return {id: key, answer: value};
            });
            navigation.navigate('IncludeSomeDetails', {
              AdData: {
                ...AdData,
                answers: data,
              },
              isPrice,
            });
          }}
          style={{width: '90%', marginHorizontal: '5%'}}
        />
      </View>
    </SafeAreaView>
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
  detailsFormSection: {
    flex: 10,
    paddingHorizontal: 5,
  },
  questionText: {fontSize: 16, color: '#222'},
});
