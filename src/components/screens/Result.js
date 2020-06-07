import React, { Component } from 'react';
import {
    Dimensions,
    Alert,
    Button,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    ImageBackground,
} from 'react-native';
import { TransparentButton } from '../shared';
import { connect } from 'react-redux';
import api from '../../api';
import Wrapper from './Wrapper';
import { Icon } from 'native-base';
import { getAppConfig } from '../../lib/appConfig';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

mapStateToProps = (state) => {
    const { auth } = state;
    return { auth }
  }
  
  mapDispatchToProps = (dispatch) => {
    return {
      onSignIn: (user) => { dispatch(signIn(user)) }
    }
  }
class Result extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imagesList: [],
        }
    }

    async componentDidMount() {
        let selectedImagesListForResults = this.props.navigation.getParam('selectedImagesListForResults')
        console.log(selectedImagesListForResults);

        this.setState({ imagesList: selectedImagesListForResults })
    }

    handleBackpress = () => this.props.navigation.goBack()
    handleMainMenuPress = () => this.props.navigation.popToTop()
    render() {
        const { imagesList, } = this.state;
        const styles = createStyles();

        return (
            <Wrapper contentContainerStyle={styles.outerContainer}>
                <View style={styles.flex1}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headertext}>RESULT</Text>
                    </View>
                    <View style={styles.flatListContainer}>
                        <FlatList
                            horizontal
                            extraData={this.state}
                            // columnWrapperStyle={styles.columnWrapperStyle}
                            style={styles.flatlistStyles}
                            contentContainerStyle={styles.imageListContainer}
                            data={imagesList}
                            renderItem={this._renderImages}
                            keyExtractor={(item, ind) => ind}
                        />
                    </View>
                </View>
                <View style={styles.resContainer}>
                    <View style={styles.sentHeadingContainer}>
                        <Text style={styles.sentHeading}>SENTENCE</Text>
                    </View>
                    <View style={styles.sentContainer}>
                        <TouchableOpacity>
                            <Icon style={styles.speakerIcon} name={'volume-high'} type='MaterialCommunityIcons' />
                        </TouchableOpacity>
                        <Text adjustsFontSizeToFit style={styles.sent}>SENTENCE GOES HERE....</Text>
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                    <TransparentButton onPress={this.handleBackpress} title={'< BACK'} />
                    <TransparentButton onPress={this.handleMainMenuPress} title={'MAIN MENU'} />
                </View>
            </Wrapper>
        );
    }
    _renderImages = ({ item }) => {
        const styles = createStyles();
        return (
            <View>
                <Image style={styles.itemImage} source={{ uri: item?.url }} />
            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Result);
const createStyles = () => {
    let config = getAppConfig()
    let { appFontFamily, appFontSize, appImageSize, appLanguage, appPrimaryColor, appSecondaryColor } = config
    return StyleSheet.create({
    speakerIcon: {
        color: appSecondaryColor, fontSize: 40*appFontSize, fontFamily: appFontFamily,
    },
    outerContainer: {
        flex: 1
    },
    resContainer: {
        marginVertical: 20,
        flex: 1,
    },
    sentHeadingContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    sentHeading: {
        fontSize: 20*appFontSize,
        fontFamily: appFontFamily,
        fontWeight: 'bold',
        textAlign: 'center',
        color: appPrimaryColor,
    },
    sentContainer: {
        backgroundColor: appPrimaryColor,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal: 30,
        padding: 20,
        borderRadius: 70
    },
    sent: {
        fontSize: 25*appFontSize,
        fontFamily: appFontFamily,
        color: appSecondaryColor
    },
    flatlistStyles: {
        backgroundColor: appPrimaryColor,
    },
    imageListContainer: {
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    itemImage: {
        width: (34 / 100) * width,
        height: (34 / 100) * width,
        borderRadius: 25,
        marginHorizontal: 5,
        overflow: 'hidden',
        borderColor: appSecondaryColor,
        borderWidth: 3,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 40,
        marginVertical: 20,
    },
    headerContainer: {
        justifyContent: 'space-evenly',
        borderRadius: 25,
        borderWidth: 0,
        marginVertical: 20,
        backgroundColor: appPrimaryColor,
        marginHorizontal: 20,
        padding: 25,
    },
    headertext: {
        color: appSecondaryColor,
        fontWeight: 'bold',
        fontSize: 40*appFontSize,
        fontFamily: appFontFamily,
        textAlign: 'center',
    },
})};
