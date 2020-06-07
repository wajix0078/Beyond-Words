import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Text,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import IconTitleSet from './../shared/IconTitleSet';
import { RoundButton } from './../shared/Button';
import Wrapper from './Wrapper';
import api from '../../api';
import { signOutUser, setLocalUserProfile, getLocalUserProfile } from '../../auth';
import { signIn } from './../../redux'
import { LottieAnimation, Row } from './../shared'
import { Icon } from 'native-base';
const { width, height } = Dimensions.get('window')
import ThemeColors from './../../styles/colors'
import { getAppConfig } from '../../lib/appConfig';

mapStateToProps = (state) => {
    const { auth } = state;
    return { auth }
}

mapDispatchToProps = (dispatch) => {
    return {
        onSignIn: (user) => { dispatch(signIn(user)) }
    }
}
class Options extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const styles = createStyles();
        return (
            <Wrapper contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backIconContainer}>
                    <Icon style={styles.backIcon} name='md-arrow-back' type='Ionicons' />
                </TouchableOpacity>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>OPTIONS</Text>
                </View>
                <View style={styles.content}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AddImage')} style={styles.button}>
                        <Text style={styles.buttonText}>ADD IMAGE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('EditDeleteImage', { flowType: 'EDIT' }) }} style={styles.button}>
                        <Text style={styles.buttonText}>EDIT IMAGE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('EditDeleteImage', { flowType: 'DELETE' }) }} style={styles.button}>
                        <Text style={styles.buttonText}>DELETE IMAGE</Text>
                    </TouchableOpacity>
                </View>
            </Wrapper>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Options);

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
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginTop: 60
    },
    header: {
        justifyContent: 'space-evenly',
        borderRadius: 25,
        borderWidth: 0,
        marginTop: 20,
        backgroundColor: appPrimaryColor,
        marginHorizontal: 20,
        padding: 25,
    },
    headerTitle: {
        color: appSecondaryColor,
        fontWeight: 'bold',
        fontSize: 40*appFontSize,
        fontFamily: appFontFamily,
        textAlign: 'center',
    },
    button: {
        marginTop: 15,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: appPrimaryColor,
        width: 200,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18*appFontSize,
        fontFamily: appFontFamily,
        fontWeight: "bold",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderColor: appPrimaryColor,
        color: appPrimaryColor,
        alignSelf: "center"
    }
})};




