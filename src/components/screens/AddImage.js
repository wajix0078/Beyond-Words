import React, { Component } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput
} from "react-native";
import {
    Container,
    Header,
    Content,
    Icon,
    Accordion,
    Picker
} from "native-base";
import Wrapper from "./Wrapper";
import api from "../../api";
import * as ImagePicker from 'expo-image-picker';
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

const colors = ['#FADAFF', '#ECB184', '#FFFFFF'];

export default class AddImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flowType: 'ADD', //ADD or EDIT
            isLoading: false,
            categoriesList: [],
            imageData: {
                name: '',
                categoryID: '',
                partofSpeech: 'Noun',
                symbolSetType: 'colored',
                url: ''
            }
        };
    }
    componentDidMount() {
        this.getPermissionAsync();
        this.getCategories();
    }
    getCategories = async () => {
        try {
            this.setState({ isLoading: true })
            const { imageData } = this.state
            const res = await api.getCategories()
            this.setState({ isLoading: false })
            if (res)
                this.setState({ categoriesList: res, imageData: { ...imageData, categoryID: res[0]?.id } })
            const itemToEdit = this.props.navigation.getParam('item')
            if (itemToEdit) {
                this.setState({ flowType: 'EDIT', imageData: itemToEdit })
            }
        } catch (error) {
            this.setState({ isLoading: false })
            console.log(error)
        }

    }
    uploadImageData = async (imageUrl) => {
        try {
            const { imageData } = this.state
            let userId = api.currentUser.uid;
            let dataUploadResp = await api.uploadImageDataByUserId(userId, { ...imageData, url: imageUrl })
            if (dataUploadResp) {
                this.setState({ isLoading: false })
                this.props.navigation.goBack()
            }
        } catch (error) {
            this.setState({ isLoading: false })
            console.log(error);
        }
    }
    updateImageData = async () => {
        try {
            const { id, categoryID, name, partofSpeech, symbolSetType } = this.state.imageData
            const dataUploadResp = await api.updateImageDataById(id, {
                categoryID,
                name,
                partofSpeech,
                symbolSetType,
            })
            if (dataUploadResp) {
                this.setState({ isLoading: false })
                this.props.navigation.popToTop()
            }
        } catch (error) {
            this.setState({ isLoading: false })
            console.log(error);
        }
    }
    handleSubmit = async () => {
        try {
            this.setState({ isLoading: true })
            const { imageData, flowType } = this.state
            console.log(imageData)
            if (flowType == 'ADD') {
                let imageUrl = await api.uploadImageAsync(imageData.url)
                console.log('Image available at: ', imageUrl)
                if (imageUrl) {
                    this.uploadImageData(imageUrl)
                }
                else {
                    this.setState({ isLoading: false })
                }
            }
            else {
                this.updateImageData()
            }
        } catch (error) {
            this.setState({ isLoading: false })
            console.log(error);
        }
    }
    handleBackpress = () => this.props.navigation.goBack()
    onValueChange = (key) => (itemValue) => {
        const { imageData } = this.state
        this.setState({ imageData: { ...imageData, [key]: itemValue } })
    }
    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2
        });
        console.log(result);
        const { imageData } = this.state
        if (!result.cancelled) {
            this.setState({ imageData: { ...imageData, url: result.uri } });
        }
    };
    render() {
        const { isLoading, imageData, categoriesList, flowType } = this.state;
        const { name, url, categoryID, partofSpeech, symbolSetType } = imageData

        return (
            <Wrapper isLoading={isLoading} contentContainerStyle={styles.fullscreen}>
                <TouchableOpacity onPress={this.handleBackpress} style={styles.backIconContainer}>
                    <Icon style={styles.backIcon} name='md-arrow-back' type='Ionicons' />
                </TouchableOpacity>
                <View style={styles.header}>
                    <Text style={styles.xLarge}>ADD IMAGE</Text>
                </View>

                {/* .............................................................. */}

                <View style={styles.bodystyle}>
                    <View style={styles.innerbodystyle}>
                        <View style={styles.imageView}>
                            <TouchableOpacity onPress={this._pickImage} style={styles.imageContainer}>
                                {
                                    url ?
                                        <Image style={styles.imageContainer} source={{ uri: url }} />
                                        :
                                        <>
                                            <Icon style={styles.browseText} name='file-image' type='MaterialCommunityIcons' />
                                            <Text style={styles.browseText}>BROWSE IMAGE</Text>
                                        </>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>NAME</Text>
                            </View>

                            <View style={styles.pickerContainer}>
                                <TextInput
                                    style={styles.TextInput}
                                    placeholderTextColor={'#C38060'}
                                    placeholder={'Enter name...'}
                                    value={name}
                                    onChangeText={this.onValueChange('name')}
                                />
                            </View>
                        </View>

                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>PART OF SPEECH</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={partofSpeech}
                                    onValueChange={this.onValueChange('partofSpeech')}
                                >
                                    <Picker.Item label="Noun" value="Noun" />
                                    <Picker.Item label="Pronoun" value="Pronoun" />
                                    <Picker.Item label="Verb" value="Verb" />
                                    <Picker.Item label="Adjective" value="Adjective" />
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>CATEGORY</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={categoryID}
                                    onValueChange={this.onValueChange('categoryID')}
                                >{
                                        categoriesList.map((val, index) => {
                                            return (
                                                <Picker.Item key={index} label={val.name} value={val.id} />
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>SYMBOL SET TYPE</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={symbolSetType}
                                    onValueChange={this.onValueChange('symbolSetType')}
                                >
                                    <Picker.Item label="Colored" value="colored" />
                                    <Picker.Item label="Black & White" value="bw" />
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {
                        name && url ?
                            <TouchableOpacity onPress={this.handleSubmit} style={styles.footer}>
                                <Text style={styles.savetext}>{flowType == 'EDIT' ? 'UPDATE IMAGE' : 'UPLOAD IMAGE'}</Text>
                            </TouchableOpacity>
                            : null
                    }
                </View>

                {/* .............................................................................. */}
            </Wrapper>
        );
    }
}
const styles = StyleSheet.create({
    imageContainer: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderColor: '#5D4242',
        borderRadius: 15,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    browseText: {
        color: '#5D4242',
        textAlign: 'center'
    },
    backIconContainer: {
        marginTop: 25,
        marginLeft: 25,
        width: 50,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#5D4242',
        borderRadius: 15,
    },
    backIcon: {
    },
    fullscreen: {
        paddingRight: 0,
        backgroundColor: "#ECB184",
        height: height,
        width: width
    },
    lefticon: {
        width: 40,
        marginTop: 7,
        marginLeft: 7,
        paddingHorizontal: 3,
        borderRadius: 50,
        borderWidth: 1
    },
    header: {
        backgroundColor: "#5D4242",
        paddingHorizontal: 35,
        padding: 20,
        borderRadius: 50,
        alignSelf: "center",
        marginTop: 10
    },

    textSmall: {
        fontSize: 11
    },
    textBold: {
        fontSize: 15,
        fontWeight: "bold"
    },
    textMedium: {
        fontSize: 15,
        color: "grey"
    },
    textLarge: {
        fontFamily: "normal",
        fontSize: 30,
        fontWeight: "bold"
    },
    xLarge: {
        fontSize: 45,
        fontWeight: "bold",
        justifyContent: "center",
        alignSelf: "center",
        color: "#ECB184"
    },
    TextInput: { paddingHorizontal: 10 },

    // .............................................

    bodystyle: {
        flex: 1,
        marginRight: 2
    },
    innerbodystyle: {
        paddingHorizontal: 20,
        paddingRight: 50,
        marginTop: 10,
        flexDirection: "column"
    },
    settings: {
        marginTop: 15,
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    labelContainer: {
        backgroundColor: '#5D4242',
        borderRadius: 20,
        justifyContent: 'center'
    },
    settingstext: {
        alignSelf: "center",
        paddingHorizontal: 10,
        // backgroundColor: "#5D4242",
        color: '#ECB184',
        padding: 3,
        borderRadius: 10,
        fontWeight: "bold"
    },
    pickerContainer: {
        width: 125,
        borderColor: '#5D4242',
        borderRadius: 20,
        borderWidth: 2,
        height: 30,
        justifyContent: 'center'
    },
    pickerText: {
        color: '#5D4242',
    },
    caret: {
        marginLeft: 0,
        fontSize: 14,
        color: '#5D4242'
    },
    isActive: {
        borderColor: '#5D4242',
        borderRadius: 20,
        borderWidth: 2,
    },

    // ...........................................

    backgroundcolor: {
        marginTop: 10,
        paddingLeft: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttons: {
        justifyContent: "space-evenly",
        flexDirection: "row",
    },
    color1: {
        marginHorizontal: 10,
        width: 80,
        height: 30,
        borderRadius: 30,
        padding: 10,
    },
    footer: {
        marginTop: 15,
        // paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#5D4242',
        width: 200,
        alignSelf: 'center',
        alignItems: 'center'
    },
    savetext: {
        fontSize: 18,
        fontWeight: "bold",
        paddingHorizontal: 20,
        padding: 8,
        color: '#5D4242',
        alignSelf: "center"
    }
    // ..................,............................
});

