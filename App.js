/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Axios from "axios";

const App = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("")

  const submit = () => {
    if (name && message) {
      Axios.post('http://192.168.18.232:3000/', { name, message }, {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(res => console.log("response", res))
        .catch(err => console.log("error", err))
    }
    else alert("Please enter details")
  }

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <View style={{ flex: 1, padding: 20 }}>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10 }} />
        <TextInput placeholder="Message" value={message} onChangeText={setMessage} style={{ borderWidth: 1, padding: 10, marginTop: 5 }} />
        <TouchableOpacity onPress={submit} style={{ marginTop: 20, padding: 10, alignSelf: "center", backgroundColor: "lightgray" }}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default App;
