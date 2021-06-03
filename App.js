/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Axios from "axios";

const App = () => {
  const [_id, setId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ name: "abc", message: "hello" }]);
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState([])

  useEffect(() => {
    getMessages()
  }, [])

  const sendMessage = () => {
    if (name && message) {
      Axios.post(
        'http://192.168.18.232:3000/send_messages',
        { name, message },
        // 'http://192.168.18.232:3000/send_multi_messages',
        // [{ name, message }, { name, message }],
        { headers: { 'Content-Type': 'application/json' } }
      )
        .then(res => {
          console.log("send response", res)
          setName('')
          setMessage('')
          getMessages()
        })
        .catch(err => console.log("error", err))
    }
    else alert("Please enter details")
  }

  const getMessages = () => {
    Axios.get('http://192.168.18.232:3000/get_messages')
      .then(res => {
        console.log("get response", res)
        setMessages(res.data)
      })
      .catch(err => console.log(err))
  }

  const editMessage = (item) => {
    setId(item._id)
    setName(item.name)
    setMessage(item.message)
    setEdit(true)
  }

  const updateMessage = () => {
    const payload = { _id, name, message }
    Axios.put(
      "http://192.168.18.232:3000/update_messages",
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then(res => {
        console.log("update response", res)
        setName('')
        setMessage('')
        setEdit(false)
        getMessages()
      })
      .catch(err => console.log("error", err))
  }

  const deleteMessage = (_id) => {
    Axios.delete(
      "http://192.168.18.232:3000/delete_messages",
      { headers: { 'Content-Type': 'application/json' }, data: { _id } }
    )
      .then(res => {
        console.log("delete response", res)
        getMessages()
      })
      .catch(err => console.log("error", err))
  }

  const deleteMultiMessage = () => {
    Axios.delete(
      "http://192.168.18.232:3000/delete_multi_messages",
      { headers: { 'Content-Type': 'application/json' }, data: selected }
    )
      .then(res => {
        console.log("delete response", res)
        getMessages()
        setSelected([])
      })
      .catch(err => console.log("error", err))
  }

  const multiSelect = (_id) => {
    const ind = selected.findIndex(val => val?._id == _id)
    if (ind < 0)
      setSelected([...selected, { _id }])
    else {
      let arr = [...selected]
      arr.splice(ind, 1)
      setSelected(arr)
    }

  }
  return (
    <SafeAreaView style={{ flex: 1, }} >
      <View style={{ flex: 1, padding: 20 }}>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10 }} />
        <TextInput placeholder="Message" value={message} onChangeText={setMessage} style={{ borderWidth: 1, padding: 10, marginTop: 5 }} />
        <View style={{ flexDirection: "row", justifyContent:"center"}}>
          {!edit ?
            <TouchableOpacity onPress={sendMessage} style={{ marginVertical: 15, padding: 10,  backgroundColor: "lightgray" }}>
              <Text>Send</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={updateMessage} style={{ marginVertical: 15, padding: 10,  backgroundColor: "lightgray" }}>
              <Text>Update</Text>
            </TouchableOpacity>
          }
          {selected.length ?
            <TouchableOpacity onPress={deleteMultiMessage} style={{ marginVertical: 15, padding: 10,  backgroundColor: "lightgray" }}>
              <Text>Delete</Text>
            </TouchableOpacity>
            : null
          }
        </View>
        <FlatList
          data={messages}
          extraData={selected.length}
          keyExtractor={(item, index) => index.toString()}
          style={{ backgroundColor: "lightgray" }}
          renderItem={({ item, index }) => {
            const findItem = selected.find(val => val._id == item._id)
            return (
              <View style={{ flex: 1, flexDirection: "row", paddingVertical: 20, paddingHorizontal: 5, borderBottomWidth: 1 }}>
                {findItem ? <View style={{ width: 10, height: 10, backgroundColor: "red" }} /> : null}
                <TouchableOpacity onPress={() => { multiSelect(item._id) }} style={{ flex: 1 }}>
                  <Text style={{ paddingVertical: 2 }}>Name: {item.name}</Text>
                  <Text style={{ paddingVertical: 2 }}>Message: {item.message}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", paddingLeft: 3 }}>
                  <TouchableOpacity onPress={() => deleteMessage(item._id)} style={{ padding: 10, alignSelf: "center", backgroundColor: "white" }}>
                    <Text>Del</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editMessage(item)} style={{ padding: 10, alignSelf: "center", backgroundColor: "white" }}>
                    <Text>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
        />

      </View>
    </SafeAreaView>
  );
};


export default App;
