import React from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';


export const ImagePickerModal = ({ visible, onRequestClose, onPressCamera, onPressGallery, onPressRemove, deleteBtn }) => {
  return (

    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      transparent={true}>
      <TouchableOpacity
        activeOpacity={0.1}
        onPress={onRequestClose}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.9)',
        }}>
        <View style={{ backgroundColor: "white", paddingHorizontal: 20, borderWidth: 2, borderColor: "lightgray" }}>
          <TouchableOpacity
            onPress={() => {
              onRequestClose()
              setTimeout(() => { onPressCamera() }, Platform.OS == "ios" ? 400 : 0)
            }}
            style={{
              paddingVertical: 20,
              paddingHorizontal: 10,
              borderBottomColor: "lightgray",
              borderBottomWidth: 1
            }}
          >
            <Text style={{ textAlign: "center" }}>Take Photo from your camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onRequestClose()
              setTimeout(() => { onPressGallery() }, Platform.OS == "ios" ? 400 : 0)
            }}
            style={{ borderBottomWidth: deleteBtn ? 1 : 0, borderBottomColor: "lightgray", paddingVertical: 20, paddingHorizontal: 10 }}
          >
            <Text style={{ textAlign: "center" }}>Choose Photo from Library</Text>
          </TouchableOpacity>
          {deleteBtn ?
            <TouchableOpacity
              onPress={() => {
                onPressRemove()
                onRequestClose()
              }}
              style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", paddingVertical: 20, paddingHorizontal: 10 }}
            >
              <Text style={{ textAlign: "center" }}>Delete Photo</Text>
            </TouchableOpacity>
            :
            null
          }
        </View>
      </TouchableOpacity>
    </Modal>
  )
}