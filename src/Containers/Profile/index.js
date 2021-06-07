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
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            edit: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("user").then(res => {
            let user =JSON.parse(res)
        })
    }

    getProfile = () => {


    }

    updateProfile = () => {
        const { name, email, password, confirmPassword } = this.state
        Axios.post(
            `${Variables.baseUrl}/update_profile`,
            { name, email, password, confirmPassword },
            { headers: { 'Content-Type': 'application/json' } }
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
        const { name, email, password, confirmPassword, edit } = this.state
        const { navigation: { navigate } } = this.props
        return (
            <View style={{ flex: 1, width: "100%", paddingHorizontal: 20 }}>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, paddingVertical: 30 }}>Profile</Text>
                <TextInput
                    value={name}
                    onChangeText={name => this.setState({ name })}
                    placeholder="User Name"
                    style={{ borderBottomWidth: 1, borderBottomColor: edit ? "black" : "lightgray", color: edit ? "black" : "gray" }}
                    editable={edit}
                />
                <TextInput
                    value={email}
                    onChangeText={email => this.setState({ email })}
                    placeholder="Email"
                    style={{ borderBottomWidth: 1, borderBottomColor: edit ? "black" : "lightgray", color: edit ? "black" : "gray" }}
                    editable={edit}
                />
                <TextInput
                    value={password}
                    onChangeText={password => this.setState({ password })}
                    placeholder="Password"
                    secureTextEntry={true}
                    style={{ borderBottomWidth: 1, borderBottomColor: edit ? "black" : "lightgray", color: edit ? "black" : "gray" }}
                    editable={edit}
                />
                <TextInput
                    value={confirmPassword}
                    onChangeText={confirmPassword => this.setState({ confirmPassword })}
                    secureTextEntry={true}
                    placeholder="Confirm Password"
                    style={{ borderBottomWidth: 1, borderBottomColor: edit ? "black" : "lightgray", color: edit ? "black" : "gray" }}
                    editable={edit}
                />
                { edit ?
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