import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../shared/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';

export default function QuestionsScreen({navigation, route}) {
  const AdData = route.params.AdData;
  // console.log(AdData, '18');
  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [answerData, setAnswerData] = useState({});

  const getQuestions = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const questionsRespData = await http.get(
        `question/user/?category_id=${AdData.subCategoryID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(questionsRespData.results, '29');
      const questions = questionsRespData.results.map(question => ({
        id: question.id.toString(),
        question: question.question,
      }));
      console.log(questions);
      setQuestionData(questions);
      setIsLoading(false);
    } catch (err) {
      console.log(
        'Something went wrong while fetching questions 40',
        JSON.stringify(err),
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const renderQuestion = ({item, index}) => {
    return (
      <View>
        <Text style={{color: '#222'}}>
          {index + 1}. {item.question}
        </Text>
        <TextInput
          style={styles.inputField}
          onChangeText={txt => {
            setAnswerData({...answerData, [item.id]: txt});
          }}
        />
      </View>
    );
  };
  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <View style={styles.container}>
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
        <FlatList data={questionData} renderItem={renderQuestion} />
      </View>
      <View
        style={{flex: 1.5, justifyContent: 'center', alignContent: 'center'}}>
        <CustomButton
          btnTitle="Next"
          onpress={() => {
            let data = Object.entries(answerData).map(([key, value]) => {
              return {id: key, answer: value};
            });
            navigation.navigate('UploadAdPhotos', {
              AdData: {
                ...AdData,
                answers: data,
              },
            });
          }}
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
