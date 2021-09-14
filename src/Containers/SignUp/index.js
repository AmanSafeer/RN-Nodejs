import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator
} from 'react-native';
import Axios from "axios";
import { Variables } from '../../config';
import { ImagePickerModal } from '../../Components'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

class SignUp extends Component {
    constructor() {
        super()
        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            image: { uri: `` },
            imagePickerModal: false,
            loader: false
        }
    }

    openCamera = () => {
        launchCamera({ mediaType: "photo", cameraType: "back" }, (response) => {
            if (response.didCancel) { }
            else if (response.errorMessage) { }
            else if (response.customButton) { }
            else {
                console.log("res", response.assets[0])
                this.setState({ image: response.assets[0] })
            }
        })
    }

    openGallery = () => {
        launchImageLibrary({ mediaType: "photo" }, (response) => {
            if (response.didCancel) { }
            else if (response.errorMessage) { }
            else if (response.customButton) { }
            else {
                console.log("res", response.assets[0])
                this.setState({ image: response.assets[0] })
            }
        })
    }


    signup = () => {
        const { name, email, password, confirmPassword, image } = this.state
        const { navigation: { navigate } } = this.props

        const formData = new FormData()
        // const video = image.uri ? { ...image, name: image.fileName || image.uri.split("/")[image.uri.split("/").length - 1], uri: image.uri, type: `video/${image.uri.split(".")[2]}`} : ""
        // formData.append("image", video)
        const img = image.uri ? { ...image, name: image.fileName || image.uri.split("/")[image.uri.split("/").length - 1], uri: image.uri, type: image.type } : ""
        formData.append("image", img)
        formData.append("username", name)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("confirmPassword", confirmPassword)

        this.setState({ loader: true })
        Axios.post(
            `${Variables.baseUrl}/signup`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'multipart/form-data'
                }
            }
        )
            .then(res => {
                console.log(res)
                alert(res.data.message)
                this.setState({ loader: false })
                navigate("VerificationCode", { email })
            })
            .catch(err => {
                alert(err.response.data.error)
                console.log(err.response)
                this.setState({ loader: false })
            })
    }

    render() {
        const { name, email, password, confirmPassword, imagePickerModal, image, loader } = this.state
        const { navigation: { navigate } } = this.props
        return (
            loader ?
                <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator color="black" size="small" />
                </View>
                :
                <View style={{ flex: 1, width: "100%", justifyContent: "center", paddingHorizontal: 20 }}>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, paddingVertical: 30 }}>Create Account</Text>
                    <TouchableOpacity
                        onPress={() => { this.setState({ imagePickerModal: true }) }}
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: "gray",
                            borderRadius: 50,
                            alignSelf: "center",
                            marginTop: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                        {image.uri ?
                            <Image source={image} style={{ width: "100%", height: "100%", borderRadius: 50, resizeMode: "cover" }} />
                            :
                            <Text>Image</Text>
                        }
                    </TouchableOpacity>
                    <TextInput
                        value={name}
                        onChangeText={name => this.setState({ name })}
                        placeholder="User Name"
                        style={{ borderBottomWidth: 1, paddingVertical: 20 }}
                    />
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
                    <TextInput
                        value={confirmPassword}
                        onChangeText={confirmPassword => this.setState({ confirmPassword })}
                        secureTextEntry={true}
                        placeholder="Confirm Password"
                        style={{ borderBottomWidth: 1, paddingVertical: 20 }}
                    />
                    <TouchableOpacity onPress={this.signup} style={{ marginTop: 30, borderRadius: 5, backgroundColor: "gray", paddingVertical: 10, paddingHorizontal: 20, alignSelf: "center" }}>
                        <Text style={{ fontSize: 20, color: "white" }}>Sign Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigate("Login") }} style={{ marginTop: 30, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 10, alignSelf: "center" }}>
                        <Text style={{ color: "brown" }}>Login</Text>
                    </TouchableOpacity>

                    <ImagePickerModal
                        visible={imagePickerModal}
                        onRequestClose={() => { this.setState({ imagePickerModal: false }) }}
                        onPressCamera={this.openCamera}
                        onPressGallery={this.openGallery}
                    />
                </View>

        )
    }
}

export default SignUp