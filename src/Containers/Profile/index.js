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


class Profile extends Component {
    constructor() {
        super()
        this.state = {
            username: "",
            email: "",
            edit: false,
            imagePickerModal: false,
            user: {},
            image: { uri: "" },
            pre_image: ""
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
                const { email, username, image_url } = res.data
                this.setState({ email, username, image: { uri: image_url ? `${Variables.baseUrl}/${image_url}` : "" } })
            })
            .catch(err => console.log(err.response))

    }

    updateProfile = () => {
        const { username, user, image, pre_image } = this.state

        const formData = new FormData()
        const img = (image.uri && image.fileName) ? { ...image, name: image.fileName || image.uri.split("/")[image.uri.split("/").length - 1], uri: image.uri, type: image.type } : ""

        formData.append("image", img)
        formData.append("username", username)

        if (pre_image) {
            const pre_img = pre_image.split("/")[pre_image.split("/").length - 1]
            formData.append("pre_image", JSON.stringify([pre_img.split(".")[0], pre_img.split(".")[1]]))
        }

        Axios.put(
            `${Variables.baseUrl}/update_profile`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'multipart/form-data',
                    access_token: user.token, _id: user._id
                }
            }
        )
            .then(res => {
                console.log("update response", res)
                alert(res.data.message)
                this.setState({ pre_image: "", edit: false }, () => {
                    this.getProfile()
                })
            })
            .catch(err => {
                alert(err.response.data.error)
                console.log(err.response)
            })
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

    render() {
        const { username, email, edit, imagePickerModal, image } = this.state
        const { navigation: { navigate } } = this.props
        return (
            <View style={{ flex: 1, width: "100%", paddingHorizontal: 20 }}>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, paddingVertical: 30 }}>Profile</Text>
                <TouchableOpacity
                    activeOpacity={edit ? 0 : 1}
                    onPress={() => { edit ? this.setState({ imagePickerModal: true }) : null }}
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
                        <Image source={image} style={{ width: 100, height: 100, borderRadius: 50, resizeMode: "cover" }} />
                        :
                        <Text>Image</Text>
                    }
                </TouchableOpacity>
                <TextInput
                    value={username}
                    onChangeText={username => this.setState({ username })}
                    placeholder="User Name"
                    style={{ borderBottomWidth: 1, paddingVertical: 20, borderBottomColor: edit ? "black" : "lightgray", color: edit ? "black" : "gray" }}
                    editable={edit}
                />
                <TextInput
                    value={email}
                    onChangeText={email => this.setState({ email })}
                    placeholder="Email"
                    style={{ borderBottomWidth: 1, paddingVertical: 20, borderBottomColor: "lightgray", color: "gray" }}
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

                <ImagePickerModal
                    visible={imagePickerModal}
                    onRequestClose={() => { this.setState({ imagePickerModal: false }) }}
                    onPressCamera={this.openCamera}
                    onPressGallery={this.openGallery}
                    onPressRemove={() => { this.setState({ pre_image: image.fileName ? "" : image.uri, image: { uri: "" } }) }}
                    deleteBtn={image.uri}

                />
            </View>

        )
    }
}

export default Profile