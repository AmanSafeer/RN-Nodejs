import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
import Axios from "axios";
import { Variables } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImagePickerModal } from '../../Components';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


class Messages extends Component {
    constructor() {
        super()
        this.state = {
            messages: [],
            message: "",
            user: {},
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("user").then(res => {
            let user = JSON.parse(res)
            console.log(user)
            this.setState({ user }, () => {
            })
        })
    }

    render() {
        const { message, messages } = this.state
        const { navigation: { navigate } } = this.props
        return (
            <View style={{ flex: 1, width: "100%", paddingHorizontal: 20, }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 30 }}>
                    <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: "lightgray", alignItems: "center", justifyContent: "center" }}>
                        <Text>+</Text>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>Messages</Text>
                    <Text onPress={() => navigate("Profile")} style={{ color: "brown" }}>Profile</Text>
                </View>
            </View>

        )
    }
}

export default Messages