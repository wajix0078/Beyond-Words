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
import api from '../../api';
import Wrapper from './Wrapper';
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
 
export default class Result extends Component {

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
        return (
            <View>
                <Image style={styles.itemImage} source={{ uri: item?.url }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    speakerIcon: {
        color: '#ECB184', fontSize: 40,
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
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#5D4242',
    },
    sentContainer: {
        backgroundColor: '#5D4242',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal: 30,
        padding: 20,
        borderRadius: 70
    },
    sent: {
        fontSize: 25,
        color: '#ECB184'
    },
    flatlistStyles: {
        backgroundColor: '#5D4242',
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
        borderColor: '#ECB184',
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
        backgroundColor: '#5D4242',
        marginHorizontal: 20,
        padding: 25,
    },
    headertext: {
        color: '#ECB184',
        fontWeight: 'bold',
        fontSize: 40,
        textAlign: 'center',
    },
});
