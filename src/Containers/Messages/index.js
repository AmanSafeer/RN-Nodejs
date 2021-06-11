import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal
} from 'react-native';
import Axios from "axios";
import { Variables } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Messages extends Component {
    constructor() {
        super()
        this.state = {
            messages: [],
            message: "",
            user: {},
            modal: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("user").then(res => {
            let user = JSON.parse(res)
            console.log(user)
            this.setState({ user }, () => {
                this.getMessages()
            })
        })
    }

    getMessages = () => {
        const { user } = this.state
        Axios.get(
            `${Variables.baseUrl}/messages`,
            { headers: { access_token: user.token, _id: user._id } }
        )
            .then(res => {
                console.log("get response", res)
                this.setState({ messages:res.data.messages })
                this.getMessages()
            })
            .catch(err => console.log(err.response))

    }

    addMessage = () => {
        const { message, user } = this.state
        this.setState({ message: "", modal: false })
        Axios.post(
            `${Variables.baseUrl}/add_message`,
            { message },
            {
                headers: {
                    'Content-Type': 'application/json',
                    access_token: user.token, _id: user._id
                }
            }
        )
            .then(res => {
                console.log(res)
                alert(res.data.message)
            })
            .catch(err => {
                alert(err.response.data.error)
                console.log(err.response)
            })
    }

    render() {
        const { message, messages, modal } = this.state
        const { navigation: { navigate } } = this.props
        return (
            <View style={{ flex: 1, width: "100%", paddingHorizontal: 20, }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 30 }}>
                    <TouchableOpacity onPress={() => this.setState({ modal: true })} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: "lightgray", alignItems: "center", justifyContent: "center" }}>
                        <Text>+</Text>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>Messages</Text>
                    <Text onPress={() => navigate("Profile")} style={{ color: "brown" }}>Profile</Text>
                </View>
                <FlatList
                    data={messages}
                    style={{ flex: 1, paddingVertical: 20 }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => { }} style={{ borderWidth: 1, borderColor: "lightgray", paddingVertical: 10, marginVertical:5, borderRadius:5, paddingHorizontal: 10 }}>
                                <Text style={{ color: "gray", marginBottom: 5 }}>From: {item.user}</Text>
                                <Text>{item.message}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
                <Modal
                    visible={modal}
                    onRequestClose={() => { this.setState({ modal: false }) }}
                    transparent={true}>
                    <TouchableOpacity
                        activeOpacity={0.1}
                        onPress={() => { this.setState({ modal: false }) }}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            // justifyContent: 'center',
                            paddingTop: 200,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                        }}>
                        <View style={{ flexDirection: "row", width: "90%", backgroundColor: "white", paddingHorizontal: 20, borderWidth: 2, borderColor: "gray" }}>
                            <TextInput
                                placeholder="Enter your message"
                                value={message}
                                onChangeText={(message) => this.setState({ message })}
                                style={{ flex: 1, paddingVertical: 10, width: "100%" }}
                            />
                            <TouchableOpacity onPress={this.addMessage} style={{ paddingHorizontal: 5, alignSelf: "center" }}>
                                <Text style={{ color: "brown" }}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }
}

export default Messages