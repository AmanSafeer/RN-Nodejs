import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from 'react-native';
import Axios from "axios";
import { Variables } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            loader: false
        }
    }

    login = () => {
        const { email, password } = this.state
        const { navigation: { navigate, replace } } = this.props
        this.setState({ loader: true })
        Axios.post(
            `${Variables.baseUrl}/login`,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
        )
            .then(res => {
                console.log(res)
                AsyncStorage.setItem("user", JSON.stringify(res.data))
                this.setState({ loader: false })
                replace("Messages")
            })
            .catch(err => {
                alert(err.response.data.error)
                console.log(err.response)
                this.setState({ loader: false })
            })
    }

    render() {
        const { email, password, loader } = this.state
        const { navigation: { navigate } } = this.props
        return (
            loader ?
                <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator color="black" size="small" />
                </View>
                :
                <View style={{ flex: 1, width: "100%", justifyContent: "center", paddingHorizontal: 20 }}>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, paddingVertical: 30 }}>Login to your account</Text>
                    <TextInput
                        value={email}
                        onChangeText={email => this.setState({ email })}
                        placeholder="Email"
                        style={{ borderBottomWidth: 1, paddingVertical: 20 }}
                    />
                    <TextInput
                        value={password}
                        onChangeText={password => this.setState({ password })}
                        placeholder="Password"
                        secureTextEntry={true}
                        style={{ borderBottomWidth: 1, paddingVertical: 20 }}
                    />
                    <TouchableOpacity onPress={this.login} style={{ marginTop: 30, borderRadius: 5, backgroundColor: "gray", paddingVertical: 10, paddingHorizontal: 20, alignSelf: "center" }}>
                        <Text style={{ fontSize: 20, color: "white" }}>Login</Text>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => { navigate("SignUp") }} style={{ marginTop: 30, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 10, alignSelf: "center" }}>
                        <Text style={{ color: "brown" }}>Sign up</Text>
                    </TouchableOpacity>
                </View>

        )
    }
}

export default Login