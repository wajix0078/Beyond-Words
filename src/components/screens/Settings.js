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
import { connect } from 'react-redux';
import api from "../../api";
import { getAppConfig, setAppConfig } from "../../lib/appConfig"
import { colorSet } from "../../styles/colors";
import {t} from 'i18n-js'
// import { scaleSize } from './mixins';
// import { appFontScale } from './appFontScale';
// import { appColors } from './colors';
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

// const colors = ['#FADAFF', '#ECB184', '#FFFFFF'];
var fonts = ['sans-serif-thin', 'serif', 'Roboto', 'monospace']

var colors = [];
for (let [key, value] of Object.entries(colorSet)) {
    colors.push(value.secondaryColor)
}

mapStateToProps = (state) => {
    const { auth } = state;
    return { auth }
}

mapDispatchToProps = (dispatch) => {
    return {
        onSignIn: (user) => { dispatch(signIn(user)) }
    }
}
class BeyondWords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            profile: {
                // sound: true,
                pictureSize: 1,
                fontSize: 1,
                language: "EN",
                fontType: fonts[0],
                // symbolSetType: "colored",
                backgroundColor: colorSet.col1.secondaryColor,
            }
        };
    }
    componentDidMount() {
        this.getUserProfile()
    }
    getUserProfile = () => {
        try {
            let config = getAppConfig()
            console.log(config)
            this.setState({
                profile:
                {
                    ...this.state.profile,
                    pictureSize: config.appImageSize,
                    fontSize: config.appFontSize,
                    language: config.appLanguage,
                    fontType: config.appFontFamily,
                    backgroundColor: config.appSecondaryColor,
                }
            })
            // this.setState({ isLoading: true })
            // let userId = api.currentUser.uid;
            // api.getUserById(userId)
            //     .then(res => {
            //         if (res) {
            //             const { sound, pictureSize, fontSize, language, fontType, symbolSetType, backgroundColor } = res
            //             this.setState({
            //                 isLoading: false,
            //                 profile: { sound, pictureSize, fontSize, language, fontType, symbolSetType, backgroundColor }
            //             })
            //         }
            //     })
        } catch (error) {
            this.setState({ isLoading: false })
            console.log(error);
        }
    }
    updateLocalConfig = async () => {
        const { fontSize, fontType, pictureSize, backgroundColor, language } = this.state.profile;
        console.log('this.state.profile:', this.state.profile)
        let newConfig = {
            appFontSize: fontSize,
            appFontFamily: fontType,
            appPrimaryColor: backgroundColor == colorSet.col1.secondaryColor ?
                colorSet.col1.primaryColor :
                backgroundColor == colorSet.col2.secondaryColor ?
                    colorSet.col2.primaryColor : colorSet.col3.primaryColor,
            appSecondaryColor: backgroundColor,
            appImageSize: pictureSize,
            appLanguage: language
            // appImageSize: pictureSize == 'Small' ? 0.5 : pictureSize == 'Large' ? 1.5 : 1,
        }
        await setAppConfig(newConfig)
        return true;
    }
    handleSubmit = async () => {
        try {
            this.setState({ isLoading: true })
            await this.updateLocalConfig()
            // const { profile } = this.state;
            // let userId = api.currentUser.uid;
            // api.updateUserById(userId, profile)
            //     .then(res => {
            this.setState({ isLoading: false })
            //     })
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
        const styles = createStyles();
        return (
            <Wrapper isLoading={isLoading} contentContainerStyle={styles.fullscreen}>
                <TouchableOpacity onPress={this.handleBackpress} style={styles.backIconContainer}>
                    <Icon style={styles.backIcon} name='md-arrow-back' type='Ionicons' />
                </TouchableOpacity>
                <View style={[styles.header]}>
                    <Text style={[styles.xLarge]}>{t('setting')}</Text>
                    {/* <Text style={[styles.xLarge]}>{SETTING}</Text> */}
                </View>

                {/* .............................................................. */}

                <View style={styles.bodystyle}>
                    <View style={styles.innerbodystyle}>
                        {/* <View style={styles.settings}>
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
                        </View> */}

                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>{t('picture_size')}</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={pictureSize}
                                    onValueChange={this.onValueChange('pictureSize')}
                                >
                                    <Picker.Item label={t('P_small')} value={0.5} />
                                    <Picker.Item label={t('P_medium')}  value={1} />
                                    <Picker.Item label={t('P_large')}  value={1.5} />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>{t('f_size')}</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={fontSize}
                                    onValueChange={this.onValueChange('fontSize')}
                                >
                                    <Picker.Item label={t('F_small')}  value={0.8} />
                                    <Picker.Item label={t('F_medium')}  value={1} />
                                    <Picker.Item label={t('F_large')}  value={1.2} />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>{t("lang")}</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={language}
                                    onValueChange={this.onValueChange('language')}
                                >
                                    <Picker.Item label={t('eng')}  value="EN" />
                                    <Picker.Item label={t('urdu')}  value="UR" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.settings}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.settingstext}>{t("f_type")}</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    iosIcon={<Icon style={styles.caret} name='caret-down' type='FontAwesome5' />}
                                    textStyle={styles.pickerText}
                                    selectedValue={fontType}
                                    onValueChange={this.onValueChange('fontType')}
                                >
                                    {
                                        fonts.map(val => <Picker.Item label={val} value={val} />)
                                    }
                                    {/* <Picker.Item label="Small" value="Small" />
                                    <Picker.Item label="Medium" value="Medium" />
                                    <Picker.Item label="Large" value="Large" /> */}
                                </Picker>
                            </View>
                        </View>

                        {/* <View style={styles.settings}>
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
                        </View> */}
                    </View>
                    <View style={styles.backgroundcolor}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.settingstext}>{t("BACKGROUND")}</Text>
                        </View>

                        <View style={styles.buttons}>
                            {
                                colors
                                    // .filter(v => v !== backgroundColor)
                                    // .filter(v => this.props.color ? (v !== this.props.color) : (v !== '#ECB184'))
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
                        <Text style={styles.savetext}>{t("save_changes")}</Text>
                    </TouchableOpacity>
                </View>

                {/* .............................................................................. */}
            </Wrapper>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BeyondWords);
const createStyles = () => {
    let config = getAppConfig()
    let { appFontFamily, appFontSize, appImageSize, appLanguage, appPrimaryColor, appSecondaryColor } = config
    return StyleSheet.create({
        backIconContainer: {
            marginTop: 25,
            marginLeft: 25,
            width: 50,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: appPrimaryColor,
            borderRadius: 15,
        },
        backIcon: {
        },
        fullscreen: {
            paddingRight: 0,
            backgroundColor: appSecondaryColor,
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
            backgroundColor: appPrimaryColor,
            paddingHorizontal: 35,
            padding: 20,
            borderRadius: 50,
            alignSelf: "center",
            marginTop: 10
        },

        textSmall: {
            fontSize: 11 * appFontSize,
            fontFamily: appFontFamily,
        },
        textBold: {
            fontSize: 15 * appFontSize,
            fontFamily: appFontFamily,
            fontWeight: "bold"
        },
        textMedium: {
            fontSize: 15 * appFontSize,
            fontFamily: appFontFamily,
            color: "grey"
        },
        textLarge: {
            fontFamily: appFontFamily,
            fontSize: 30 * appFontSize,
            fontWeight: "bold"
        },
        xLarge: {
            fontSize: 45 * appFontSize,
            fontWeight: "bold",
            justifyContent: "center",
            fontFamily: appFontFamily,
            alignSelf: "center",
            color: appSecondaryColor
            // color: appSecondaryColor
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
            backgroundColor: appPrimaryColor,
            borderRadius: 20,
            justifyContent: 'center'
        },
        settingstext: {
            alignSelf: "center",
            paddingHorizontal: 10,
            // backgroundColor: "#5D4242",
            color: appSecondaryColor,
            padding: 3,
            borderRadius: 10,
            fontWeight: "bold",
            fontSize: 12 * appFontSize,
            fontFamily: appFontFamily,
        },
        pickerContainer: {
            width: 125,
            borderColor: appPrimaryColor,
            borderRadius: 20,
            borderWidth: 2,
            height: 30,
            justifyContent: 'center'
        },
        pickerText: {
            color: appPrimaryColor,
        },
        caret: {
            marginLeft: 0,
            fontSize: 14,
            fontFamily: appFontFamily,
            color: appPrimaryColor
        },
        isActive: {
            borderColor: appPrimaryColor,
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
            flex: 1
        },
        color1: {
            marginHorizontal: 2,
            width: 60,
            height: 30,
            borderRadius: 30,
            padding: 10,
            elevation: 3
        },
        footer: {
            marginTop: 15,
            // paddingHorizontal: 20,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: appPrimaryColor,
            width: 200,
            alignSelf: 'center',
            alignItems: 'center'
        },
        savetext: {
            fontSize: 18,
            fontFamily: appFontFamily,
            fontWeight: "bold",
            paddingHorizontal: 20,
            padding: 8,
            color: appPrimaryColor,
            alignSelf: "center"
        }
        // ..................,............................
    })
};

