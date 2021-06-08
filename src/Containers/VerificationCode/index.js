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

class VerificationCode extends Component {
    constructor() {
        super()
        this.state = {
            code: "",
            email: "",
        }
    }

    componentDidMount() {
        const { navigation: { state: { params } } } = this.props
        this.setState({ ...params })
    }

    verify = () => {
        const { email, code } = this.state
        const { navigation: { navigate } } = this.props
        Axios.post(
            `${Variables.baseUrl}/verify_code`,
            { email, code },
            { headers: { 'Content-Type': 'application/json' } }
        )
            .then(res => {
                console.log(res)
                alert(res.data.message)
                navigate("Login")
            })
            .catch(err => {
                alert(err.response.data.error)
                console.log(err.response)
            })
    }

    render() {
        const { email, code } = this.state
        return (
            <View style={{ flex: 1, width: "100%", justifyContent: "center", paddingHorizontal: 20 }}>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, paddingVertical: 30 }}>Verify your account</Text>
                <TextInput
                    value={code}
                    onChangeText={code => this.setState({ code })}
                    placeholder="Verification code"
                    keyboardType="numeric"
                    style={{ borderBottomWidth: 1, paddingVertical: 20 }}
                />
                <TouchableOpacity onPress={this.verify} style={{ marginTop: 30, borderRadius: 5, backgroundColor: "gray", paddingVertical: 10, paddingHorizontal: 20, alignSelf: "center" }}>
                    <Text style={{ fontSize: 20, color: "white" }}>Verify</Text>
                </TouchableOpacity>
            </View>

        )
    }
}

export default VerificationCode