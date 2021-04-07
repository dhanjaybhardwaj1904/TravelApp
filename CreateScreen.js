import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';


export default function CreateEmployee ({ navigation, route }) {
    const getDetails = (type) => {
        if (route.params) {
            switch (type) {
                case "name":
                    return route.params.name
                case "location":
                    return route.params.location
                case "image":
                    return route.params.image
                case "details":
                    return route.params.details
            }
        }
        return ""
    }

    const [name, setName] = useState(getDetails("name"))
    const [location, setlocation] = useState(getDetails("location"))
    const [details, setdetails] = useState(getDetails("details"))
    const [image, setimage] = useState(getDetails("image"))
    const [modal, setModal] = useState(false)
    const [enableshift, setenableShift] = useState(false)

    const submitData = () => {
        fetch("https://empty-eel-20.loca.lt/send", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                location,
                image,
                details,
            })
        })
            .then(res => res.json())
            .then(data => {
                Alert.alert(`${data.name} is saved`)
                navigation.navigate("HomeScreen")
            })
            .catch(err => {
                Alert.alert("Oops....!")
            })
    }

    const updateDetails = () => {
        fetch("https://empty-eel-20.loca.lt/update", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                location,
                image,
                details,
            })
        })
            .then(res => res.json())
            .then(data => {
                Alert.alert(`${data.name} is updated`)
                navigation.navigate("HomeScreen")
            })
            .catch(err => {
                Alert.alert("someting went wrong")
            })
    }

    const pickFromGallery = async () => {
        const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        if (granted) {
            let data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5
            })
            if (!data.cancelled) {
                let newfile = {
                    uri: data.uri,
                    type: `test/${data.uri.split(".")[1]}`,
                    name: `test.${data.uri.split(".")[1]}`

                }
                handleUpload(newfile)
            }
        } else {
            Alert.alert("you need to give up permission to work")
        }
    }
    const pickFromCamera = async () => {
        const { granted } = await Permissions.askAsync(Permissions.CAMERA)
        if (granted) {
            let data = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5
            })
            if (!data.cancelled) {
                let newfile = {
                    uri: data.uri,
                    type: `test/${data.uri.split(".")[1]}`,
                    name: `test.${data.uri.split(".")[1]}`

                }
                handleUpload(newfile)
            }
        } else {
            Alert.alert("you need to give up permission to work")
        }
    }


    const handleUpload = (image) => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'travelApp')
        data.append("cloud_name", "denise1904")

        fetch("https://api.cloudinary.com/v1_1/denise1904/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json()).
            then(data => {
                setimage(data.url)
                setModal(false)
            }).catch(err => {
                Alert.alert("Oops....!")
            })
    }


    return (
        <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableshift}>
            <View >
                <TextInput
                    label='Name'
                    style={styles.inputStyle}
                    value={name}
                    onFocus={() => setenableShift(false)}
                    theme={theme}
                    mode="outlined"
                    onChangeText={text => setName(text)}
                />
                <TextInput
                    label='details'
                    style={styles.inputStyle}
                    value={details}
                    theme={theme}
                    onFocus={() => setenableShift(false)}
                    mode="outlined"
                    onChangeText={text => setdetails(text)}
                />
                <TextInput
                    label='location'
                    style={styles.inputStyle}
                    value={location}
                    theme={theme}
                    onFocus={() => setenableShift(false)}
                    mode="outlined"
                    onChangeText={text => setlocation(text)}
                />
                <Button
                    style={styles.inputStyle}
                    icon={image == "" ? "upload" : "check"}
                    mode="contained"
                    theme={theme}
                    onPress={() => setModal(true)}>
                    Upload Image
             </Button>
                {route.params ?
                    <Button
                        style={styles.inputStyle}
                        icon="content-save"
                        mode="contained"
                        theme={theme}
                        onPress={() => updateDetails()}>
                        Update details
             </Button>
                    :
                    <Button
                        style={styles.inputStyle}
                        icon="content-save"
                        mode="contained"
                        theme={theme}
                        onPress={() => submitData()}>
                        save
             </Button>
                }


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal}
                    onRequestClose={() => {
                        setModal(false)
                    }}
                >
                    <View style={styles.modalView}>
                        <View style={styles.modalButtonView}>
                            <Button icon="camera"
                                theme={theme}
                                mode="contained"
                                onPress={() => pickFromCamera()}>
                                camera
                        </Button>
                            <Button
                                icon="image-area"
                                mode="contained"
                                theme={theme}
                                onPress={() => pickFromGallery()}>
                                gallery
                        </Button>
                        </View>
                        <Button
                            theme={theme}
                            onPress={() => setModal(false)}>
                            cancel
                </Button>
                    </View>
                </Modal>

            </View>
        </KeyboardAvoidingView>


    )
}

const theme = {
    colors: {
        primary: "#006aff"
    }
}
const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    inputStyle: {
        margin: 5
    },
    modalView: {
        position: "absolute",
        bottom: 2,
        width: "100%",
        backgroundColor: "white"

    },
    modalButtonView: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
})