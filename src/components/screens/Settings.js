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
// import { scaleSize } from './mixins';
// import { appFontScale } from './appFontScale';
// import { appColors } from './colors';
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const colors = ['#FADAFF', '#ECB184', '#FFFFFF'];

export default class BeyondWords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            profile: {
                sound: true,
                pictureSize: "Small",
                fontSize: "Small",
                language: "EN",
                fontType: "Small",
                symbolSetType: "colored",
                backgroundColor: "#ECB184",
            }
        };
    }
    componentDidMount() {
        this.getUserProfile()
    }
    getUserProfile = () => {
        try {
            this.setState({ isLoading: true })
            let userId = api.currentUser.uid;
            api.getUserById(userId)
                .then(res => {
                    if (res) {
                        const { sound, pictureSize, fontSize, language, fontType, symbolSetType, backgroundColor } = res
                        this.setState({
                            isLoading: false,
                            profile: { sound, pictureSize, fontSize, language, fontType, symbolSetType, backgroundColor }
                        })
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }
    handleSubmit = () => {
        try {
            this.setState({ isLoading: true })
            const { profile } = this.state
            let userId = api.currentUser.uid;
            api.updateUserById(userId, profile)
                .then(res => {
                    this.setState({ isLoading: false })
                })
        } catch (error) {
            this.setState({ isLoading: false })
            console.log(error);
        }
    }
    handleBackpress = () => this.props.navigation.goBack()
    onValueChange = (key) => (itemValue) => {
        const { profile } = this.state
        this.setState({ profile: { ...profile, [key]: itemValue } })
    }
    render() {
        const { isLoading, profile } = this.state;
        const { sound, pictureSize, fontSize, language, fontType, symbolSetType, backgroundColor } = profile

        return (
            <Wrapper isLoading={isLoading} contentContainerStyle={styles.fullscreen}>
                <TouchableOpacity onPress={this.handleBackpress} style={styles.backIconContainer}>
                    <Icon style={styles.backIcon} name='md-arrow-back' type='Ionicons' />
                </TouchableOpacity>
                <View style={styles.header}>
                    <Text style={styles.xLarge}>SETTING</Text>
                </View>

                {/* .............................................................. */}

                <View style={styles.bodystyle}>
                    <View style={styles.innerbodystyle}>
                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>SOUND</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => this.setState({ profile: { ...profile, sound: !sound } })}
                                style={styles.selection}>
                                <Icon style={styles.icon} type='MaterialCommunityIcons'
                                    name={sound ? "volume-high" : "volume-off"}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>PICTURE SIZE</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={pictureSize}
                                    onValueChange={this.onValueChange('pictureSize')}
                                >
                                    <Picker.Item label="Small" value="Small" />
                                    <Picker.Item label="Medium" value="Medium" />
                                    <Picker.Item label="Large" value="Large" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>FONT SIZE</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={fontSize}
                                    onValueChange={this.onValueChange('fontSize')}
                                >
                                    <Picker.Item label="Small" value="Small" />
                                    <Picker.Item label="Medium" value="Medium" />
                                    <Picker.Item label="Large" value="Large" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>LANGUAGE</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={language}
                                    onValueChange={this.onValueChange('language')}
                                >
                                    <Picker.Item label="English" value="EN" />
                                    <Picker.Item label="URDU" value="UR" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>FONT TYPE</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={fontType}
                                    onValueChange={this.onValueChange('fontType')}
                                >
                                    <Picker.Item label="Small" value="Small" />
                                    <Picker.Item label="Medium" value="Medium" />
                                    <Picker.Item label="Large" value="Large" />
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
                    <View style={styles.backgroundcolor}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.settingstext}>BACKGROUND</Text>
                        </View>

                        <View style={styles.buttons}>
                            {
                                colors.filter(v => this.props.color ? (v !== this.props.color) : (v !== '#ECB184'))
                                    .map(val => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => this.setState({ profile: { ...profile, backgroundColor: val } })}
                                                style={[styles.color1, { backgroundColor: val },
                                                backgroundColor == val && styles.isActive,]} />
                                        )
                                    })
                            }

                            {/* <TouchableOpacity style={styles.color2}>
                                <Text></Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>

                    <TouchableOpacity onPress={this.handleSubmit} style={styles.footer}>
                        <Text style={styles.savetext}>SAVE CHANGES</Text>
                    </TouchableOpacity>
                </View>

                {/* .............................................................................. */}
            </Wrapper>
        );
    }
}
const styles = StyleSheet.create({
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

