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

export default class History extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            historyList: []
        }
    }
    getHistory = () => {
        this.setState({ isLoading: true })
        api.getHistoryByUserId(api.currentUser.uid)
            .then(res => {
                this.setState({ historyList: res, isLoading: false })
            })
            .catch(e => {
                this.setState({ isLoading: false })
                console.log(e)
            })
    }
    async componentDidMount() {
        this.getHistory()
    }
    handleBackpress = () => this.props.navigation.goBack()

    render() {
        const {
            isLoading,
            historyList,
        } = this.state;

        return (
            <Wrapper isLoading={isLoading} contentContainerStyle={styles.outerContainer}>
                <View style={styles.flex1}>
                    <View style={styles.container}>
                        <Text style={styles.headertext}>HISTORY</Text>
                    </View>
                    <View style={styles.flatListContainer}>
                        <FlatList
                            style={styles.flatList}
                            contentContainerStyle={styles.flatlistContentContainer}
                            data={historyList}
                            renderItem={this.categoryImages}
                            keyExtractor={(item, ind) => ind}
                        />
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                    <TransparentButton onPress={this.handleBackpress} title={'< BACK'} />
                </View>
            </Wrapper>
        );
    }
    categoryImages = ({ item }) => {
        return (
            <>
                <View style={styles.item}>
                    <Text numberOfLines={1} style={styles.date}>{new Date(item?.date).toDateString()}</Text>
                    <Text numberOfLines={1} style={styles.sentence}>{item?.sentence}</Text>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    flex1: { flex: 1 },
    buttonsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 40,
        marginVertical: 20,
    },
    outerContainer: {
        flex: 1,
        backgroundColor: '#ECB184'
    },
    container: {
        justifyContent: 'space-evenly',
        borderRadius: 25,
        borderWidth: 0,
        marginTop: 20,
        backgroundColor: '#5D4242',
        marginHorizontal: 20,
        padding: 25,
    },
    item: {
        marginTop: 5,
        marginHorizontal: 5,
        padding: 5,
        borderWidth: 3 / 2,
        borderColor: '#5D4242',
        borderRadius: 5,
        justifyContent: 'center',
    },
    headertext: {
        color: '#ECB184',
        fontWeight: 'bold',
        fontSize: 40,
        textAlign: 'center',
    },
    flatListContainer: {
        flex: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        borderColor: '#5D4242',
        borderWidth: 3 / 2,
        marginTop: -6,
        marginHorizontal: 30,
        overflow: 'hidden'
    },
    flatList: {
    },
    flatlistContentContainer: {
    },
    date: {
        color: '#5D4242',
        fontSize: 8,
        fontWeight: 'bold',
    },
    sentence: {
        color: '#5D4242',
        fontWeight: 'bold',
    },
});
