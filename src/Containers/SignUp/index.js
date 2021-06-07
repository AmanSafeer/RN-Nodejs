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

class SignUp extends Component {
    constructor() {
        super()
        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    }

    signup = () => {
        const { name, email, password, confirmPassword } = this.state
        const { navigation: { navigate } } = this.props
        Axios.post(
            `${Variables.baseUrl}/signup`,
            { name, email, password, confirmPassword },
            { headers: { 'Content-Type': 'application/json' } }
        )
            .then(res => {
                console.log(res)
                alert(res.data.message)
                navigate("VerificationCode", { email })
            })
            .catch(err => {
                alert(err.response.data.error)
                console.log(err.response)
            })
    }

    render() {
        const { name, email, password, confirmPassword } = this.state
        const { navigation: { navigate } } = this.props
        return (
            <View style={{ flex: 1, width: "100%", justifyContent: "center", paddingHorizontal: 20 }}>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, paddingVertical: 30 }}>Create Account</Text>
                <TextInput
                    value={name}
                    onChangeText={name => this.setState({ name })}
                    placeholder="User Name"
                    style={{ borderBottomWidth: 1 }}
                />
                <TextInput
                    value={email}
                    onChangeText={email => this.setState({ email })}
                    placeholder="Email"
                    style={{ borderBottomWidth: 1 }}
                />
                <TextInput
                    value={password}
                    onChangeText={password => this.setState({ password })}
                    placeholder="Password"
                    secureTextEntry={true}
                    style={{ borderBottomWidth: 1 }}
                />
                <TextInput
                    value={confirmPassword}
                    onChangeText={confirmPassword => this.setState({ confirmPassword })}
                    secureTextEntry={true}
                    placeholder="Confirm Password"
                    style={{ borderBottomWidth: 1 }}
                />
                <TouchableOpacity onPress={this.signup} style={{ marginTop: 30, borderRadius: 5, backgroundColor: "gray", paddingVertical: 10, paddingHorizontal: 20, alignSelf: "center" }}>
                    <Text style={{ fontSize: 20, color: "white" }}>Sign Up</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => { navigate("Login") }} style={{ marginTop: 30, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 10, alignSelf: "center" }}>
                    <Text style={{ color: "brown" }}>Login</Text>
                </TouchableOpacity>
            </View>

        )
    }
}

export default SignUp