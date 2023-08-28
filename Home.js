import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  const [count, setHomeCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [checked, setChecked] = useState([]);

  //store Count in asyncStorage
  const storeData = async (value, key) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  //get  Count in asyncStorage
  const fetchAllItems = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);

      return items;
    } catch (error) {
      console.log(error, 'problem');
    }
  };
  // Add/Remove checked item from list
  const handleCheck = value => {
    if (checked.includes(value)) {
      setChecked(checked.filter(item => item !== value));
    } else {
      setChecked([...checked, value]);
    }
  };

  //Store first count = 0 to AsyncStorage
  useEffect(() => {
    storeData(count, 'count');
  }, []);
  //fetch all data when count changed
  useEffect(() => {
    fetchAllItems().then(value => {
      console.log('ALL', value);
      setUsers(value);
    });
  }, [count]);

  // update count after creating new reminderForm
  if (typeof route !== 'undefined') {
    // the variable is defined
    useEffect(() => {
      if (route.params?.updatedCount) {
        setHomeCount(route.params.updatedCount);
      }
    }, [route.params?.updatedCount]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{alignItems: 'center'}}>
        <View style={styles.headBar}>
          <View style={{width: '40%'}}></View>
          <View style={{width: '30%'}}>
            <Text style={{color: 'red'}}>Reminder</Text>
          </View>
          <View
            style={{width: '30%', alignItems: 'flex-end', paddingRight: 10}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('reminderForm', {setHomeCount})
              }>
              <Text style={{}}>New</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {users.length === 1 ? (
        <View style={{height: '100%'}}>
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16}}>
              Make your first reminder by clicking new Button!
            </Text>
          </View>
        </View>
      ) : (
        ''
      )}

      <ScrollView style={{marginLeft: 20, marginRight: 20}}>
        {users
          .filter(key => {
            return key[0] !== 'count';
          })
          .sort()

          .map((user, index) => (
            <View
              style={{
                height: 100,
                width: '100%',

                marginTop: 10,

                borderWidth: 1,
                borderColor: 'grey',
                borderRadius: 10,
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={{marginTop: 10}}>
                  {JSON.parse(user[1]).reminderTitle}
                </Text>

                <Text style={{marginTop: 10}}>
                  {JSON.parse(user[1]).notesContent === ''
                    ? 'No Notes'
                    : JSON.parse(user[1]).notesContent}
                </Text>
                <View key={user[0]} style={{flexDirection: 'row'}}>
                  <Text style={{marginTop: 10}}>
                    {JSON.parse(user[1]).date}
                  </Text>
                  <Text style={{marginTop: 10, marginLeft: 10}}>
                    {JSON.parse(user[1]).time}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => {
                  handleCheck(user[0]);
                }}>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                  }}
                  source={
                    checked.includes(user[0])
                      ? require('./checked.png')
                      : require('./unchecked.png')
                  }
                />
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headBar: {
    flexDirection: 'row',

    justifyContent: 'center',

    paddingBottom: 3,
    width: '100%',
  },
});

export default Home;
