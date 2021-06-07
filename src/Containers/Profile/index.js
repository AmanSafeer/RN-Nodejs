import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import Axios from "axios";
import { Variables } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component {
    constructor() {
        super()
        this.state = {
            username: "",
            email: "",
            edit: false,
            user: {}
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("user").then(res => {
            let user = JSON.parse(res)
            console.log(user)
            this.setState({ user }, () => {
                this.getProfile()
            })
        })
    }

    getProfile = () => {
        const { user } = this.state
        Axios.get(
            `${Variables.baseUrl}/get_profile`,
            { headers: { access_token: user.token, _id: user._id } }
        )
            .then(res => {
                console.log("get response", res)
                const { email, username } = res.data
                this.setState({ email, username })
            })
            .catch(err => console.log(err.response))

    }

    updateProfile = () => {
        const { username, user } = this.state
        Axios.post(
            `${Variables.baseUrl}/update_profile`,
            { username },
            { headers: { 'Content-Type': 'application/json', access_token: user.token, _id: user._id } }
        )
            .then(res => {
                console.log("update response", res)
                alert(res.data.message)
                this.setState({ edit: false }, () => {
                    this.getProfile()
                })
            })
            .catch(err => {
                alert(err.response.data.error)
                console.log(err.response)
            })
    }

    render() {
        const { username, email, edit } = this.state
        const { navigation: { navigate } } = this.props
        return (
            <View style={{ flex: 1, width: "100%", paddingHorizontal: 20 }}>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, paddingVertical: 30 }}>Profile</Text>
                <TextInput
                    value={username}
                    onChangeText={username => this.setState({ username })}
                    placeholder="User Name"
                    style={{ borderBottomWidth: 1, borderBottomColor: edit ? "black" : "lightgray", color: edit ? "black" : "gray" }}
                    editable={edit}
                />
                <TextInput
                    value={email}
                    onChangeText={email => this.setState({ email })}
                    placeholder="Email"
                    style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", color: "gray" }}
                    editable={false}
                />
                {edit ?
                    <TouchableOpacity onPress={this.updateProfile} style={{ marginTop: 30, borderRadius: 5, backgroundColor: "gray", paddingVertical: 10, paddingHorizontal: 20, alignSelf: "center" }}>
                        <Text style={{ fontSize: 20, color: "white" }}>Update</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => this.setState({ edit: true })} style={{ marginTop: 30, borderRadius: 5, backgroundColor: "gray", paddingVertical: 10, paddingHorizontal: 20, alignSelf: "center" }}>
                        <Text style={{ fontSize: 20, color: "white" }}>Edit</Text>
                    </TouchableOpacity>
                }
            </View>

        )
    }
}

export default Profile