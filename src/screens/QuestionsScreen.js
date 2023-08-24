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
  Alert,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../shared/components/CustomButton';
import {http} from '../shared/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalView from '../shared/components/ModalView';
import {AuthContext} from '../context/AuthContext';

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
  const {logout} = useContext(AuthContext);

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
      if (questionsRespData.results && questionsRespData.results.length > 0) {
        let answerArr = {};
        const questions = questionsRespData.results?.map((question, index) => {
          let data = {
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
          };
          if (data.field === 'Toggle') {
            answerArr[data.id] = 'No';
          }
          return data;
        });
        setQuestionData(questions);
        setAnswerData({...answerArr});
      } else {
        setIsLoading(false);
        navigation.replace('IncludeSomeDetails', {
          AdData: {
            ...AdData,
            answers: [],
          },
          isPrice,
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      } else {
        Alert.alert(
          'ERROR',
          'Something went wrong, Unable to Fetch Questions',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const handleAnswer = (id, answer) => {
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
    if (item.field === 'Text') {
      return (
        <View style={{marginTop: 25}}>
          <Text allowFontScaling={false} style={styles.questionText}>
            {item.question}
            {item.isRequired && (
              <Text allowFontScaling={false} style={{color: 'red'}}>
                {' '}
                *
              </Text>
            )}
          </Text>
          <TextInput
            allowFontScaling={false}
            placeholder={item.placeholder}
            maxLength={item.answerLimit}
            onChangeText={answer => handleAnswer(item.id, answer)}
            style={{borderBottomWidth: 1, padding: 1, color: '#111'}}
          />
        </View>
      );
    } else if (item.field === 'Dropdown') {
      return (
        <View style={{marginTop: 25}}>
          <Text allowFontScaling={false} style={styles.questionText}>
            {item.question}
            {item.isRequired && (
              <Text allowFontScaling={false} style={{color: 'red'}}>
                *
              </Text>
            )}
          </Text>
          <TouchableOpacity
            style={{borderBottomWidth: 1, padding: 5}}
            onPress={() => {
              setSelectedDropdownItemId(item.id);
              setModalVisible(true);
            }}>
            <Text allowFontScaling={false} style={{color: '#111'}}>
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
      );
    } else if (item.field === 'Number') {
      return (
        <View style={{marginTop: 25}}>
          <Text allowFontScaling={false} style={styles.questionText}>
            {item.question}
            {item.isRequired && (
              <Text allowFontScaling={false} style={{color: 'red'}}>
                *
              </Text>
            )}
          </Text>
          <TextInput
            allowFontScaling={false}
            placeholder={item.placeholder}
            maxLength={item.answerLimit}
            keyboardType="numeric"
            style={{borderBottomWidth: 1, padding: 1, color: '#111'}}
            onChangeText={answer => handleAnswer(item.id, answer)}
          />
        </View>
      );
    } else if (item.field === 'Toggle') {
      return (
        <View
          style={{
            marginTop: 25,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text allowFontScaling={false} style={styles.questionText}>
            {item.question}
            {item.isRequired && (
              <Text allowFontScaling={false} style={{color: 'red'}}>
                *
              </Text>
            )}
          </Text>
          <Switch
            value={answerData[item.id] === 'No' ? false : true}
            onValueChange={selected => handleToggle(item.id, selected)}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  const handleNext = () => {
    const requiredQuestions = questionData.filter(
      question => question.isRequired,
    );
    const answeredQuestions = Object.keys(answerData).map(key => parseInt(key));
    const unansweredQuestions = requiredQuestions.filter(
      question => !answeredQuestions.includes(parseInt(question.id)),
    );

    if (unansweredQuestions.length > 0) {
      alert(
        `Please answer the following required questions:\n${unansweredQuestions
          .map(question => question.question)
          .join(',\n')}`,
      );
      return;
    }
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
            navigation.goBack();
          }}>
          <MaterialIcon name="arrow-back" color={'#111'} size={28} />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.headingText}>
          Include Some Details
        </Text>
      </View>
      <View style={styles.detailsFormSection}>
        <FlatList
          data={questionData}
          renderItem={renderQuestion}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text allowFontScaling={false}>
              <Text allowFontScaling={false} style={{color: 'red'}}>
                *
              </Text>
              mark fields are required fields.
            </Text>
          }
        />
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <CustomButton
          btnTitle="Next"
          onpress={handleNext}
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
    paddingHorizontal: 20,
  },
  questionText: {fontSize: 16, fontWeight: 500, color: '#222'},
});
