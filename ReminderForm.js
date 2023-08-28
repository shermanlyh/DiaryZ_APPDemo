import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReminderForm = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [timeAdded, setTimeAdd] = useState(false);
  const [exactDate, setExactDate] = useState('');
  const [time, setTime] = useState('');
  const [reminderContent, setReminder] = useState('');
  const [notesContent, setNotes] = useState('');
  const [count, setCount] = useState(0);
  const route = useRoute();
  const setHomeCount = route.params?.setHomeCount;

  const storeData = async (value, key) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  };
  const getAsyData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      console.log('running');
      const lastValue = JSON.parse(jsonValue);
      console.log('Here ', key, lastValue);
      return lastValue;
    } catch (e) {
      // error reading value
    }
  };
  const fetchAllItems = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);

      return items;
    } catch (error) {
      console.log(error, 'problemo');
    }
  };

  return (
    <SafeAreaView style={{margin: 20, flex: 1}}>
      <View style={{}}>
        <Text>Reminder</Text>
        <TextInput
          placeholder="Take advice"
          onChangeText={text => {
            setReminder(text);
          }}
          style={{marginTop: 10}}></TextInput>

        <View
          style={{
            width: '100%',
            backgroundColor: '#C5C6D0',
            height: 1,
            marginTop: 10,
          }}></View>
      </View>
      <View style={{marginTop: 10}}>
        <Text>Notes (optional)</Text>
        <TextInput
          onChangeText={text => {
            setNotes(text);
          }}
          placeholder="Details to Add?"
          style={{marginTop: 10}}></TextInput>
        <View
          style={{
            width: '100%',
            backgroundColor: '#C5C6D0',
            height: 1,
            marginTop: 10,
          }}></View>
      </View>
      <View style={{marginTop: 10}}>
        <Text>When</Text>
        <TouchableOpacity
          onPress={() => {
            setOpen(!open);
          }}
          style={{
            alignSelf: 'center',
            width: '70%',
            backgroundColor: '#281E5D',
            borderRadius: 10,
            height: 28,
          }}>
          <Text style={{color: 'white', alignSelf: 'center', padding: 5}}>
            {timeAdded ? 'Change Time' : 'Add Time'}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          minimumDate={new Date()}
          open={open}
          date={date}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            setExactDate(date.toISOString().substring(0, 10));
            setTime(date.toISOString().substring(11, 16));
            setTimeAdd(true);
            console.log(
              'date',
              date.toISOString().substring(0, 10),
              date.toISOString().substring(11, 16),
            );
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />

        <View
          style={{
            width: '100%',
            backgroundColor: '#C5C6D0',
            height: 1,
            marginTop: 10,
          }}></View>
      </View>
      {timeAdded && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View>
              <Text>Date of Reminder</Text>
              <Text style={{marginTop: 10}}>{exactDate}</Text>
            </View>
            <View>
              <Text>Time of Reminder</Text>
              <Text style={{marginTop: 10}}>{time}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setTimeAdd(false);
              setExactDate('');
              setTime('');
            }}
            style={{
              alignSelf: 'center',
              width: '70%',
              backgroundColor: 'red',
              borderRadius: 10,
              height: 28,
              marginTop: 10,
            }}>
            <Text style={{color: 'white', alignSelf: 'center', padding: 5}}>
              Clear Schedule
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              backgroundColor: '#C5C6D0',
              height: 1,
              marginTop: 10,
            }}></View>
        </View>
      )}

      <View style={{height: '50%'}}></View>
      {!timeAdded && <View style={{height: '15%'}}></View>}
      <TouchableOpacity
        onPress={() => {
          if (reminderContent === '') {
            console.log('Empty Reminder');
            Alert.alert('Alert', 'Please name your Reminder', [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
          } else {
            getAsyData('count').then(value => {
              var newV = Number(value) + 1;
              console.log('newv', newV);
              setCount(newV);
              storeData(newV, 'count').then(() => {
                let obj = {
                  reminderiD: newV,
                  reminderTitle: reminderContent,
                  notesContent: notesContent,
                  date: exactDate,
                  time: time,
                };
                var x = 'reminder' + newV;
                console.log('String', count);
                setHomeCount(newV);
                storeData(obj, x).then(() => {
                  fetchAllItems().then(value => console.log('ALL', value));
                });
              });
            });

            navigation.navigate('Home', {updatedCount: count});
          }
        }}
        style={{
          alignSelf: 'center',
          width: 370,
          backgroundColor: '#281E5D',
          borderRadius: 10,
          height: 40,
        }}>
        <Text style={{color: 'white', alignSelf: 'center', padding: 10}}>
          Create
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 0.2,
    width: '100%',
  },
});

export default ReminderForm;
