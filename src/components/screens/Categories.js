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

export default class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            screenType: 'Categories', //Categories or Images
            imagesList: [],
            categoriesList: [],

            selectedImagesForCurrentCategory: [],

            selectedImagesListForResults: [],
        }
    }
    getCategories = () => {
        this.setState({ isLoading: true })
        api.getCategories()
            .then(res => {
                this.setState({ categoriesList: res, isLoading: false })
            })
            .catch(e => {
                this.setState({ isLoading: false })
                console.log(e)
            })

    }
    getImagesByCategories = (catId) => {
        this.setState({ isLoading: true })
        let userId = api.currentUser.uid;
        api.getImagesByUserAndCategoryId(userId, catId)
            .then(res => {
                this.setState({ imagesList: res, isLoading: false })
            })
            .catch(e => {
                this.setState({ isLoading: false })
                console.log(e)
            })

    }
    async componentDidMount() {
        this.getCategories()
    }
    toggleScreenType = () => {
        const { screenType } = this.state
        this.setState({ screenType: screenType == 'Categories' ? 'Images' : 'Categories', selectedImagesForCurrentCategory: [] })
    }
    handleSelectedImagesForCurrentCategory = (selectedItem) => {
        let { selectedImagesForCurrentCategory } = this.state

        let selectedItemExistingindex = selectedImagesForCurrentCategory.findIndex((val) => val.id == selectedItem.id)

        if (selectedItemExistingindex > -1) { //if item id exists remove it
            let newList = selectedImagesForCurrentCategory.map(v => v)
            newList.splice(selectedItemExistingindex, 1)
            this.setState({ selectedImagesForCurrentCategory: newList })
        }
        else { //if item id doesn't exist add it
            let newList = selectedImagesForCurrentCategory.map(v => v)
            newList.push(selectedItem)
            this.setState({ selectedImagesForCurrentCategory: newList })
        }
    }
    handleItemPress = async (item) => {
        const { screenType } = this.state
        if (screenType == 'Categories') {
            this.toggleScreenType()
            this.getImagesByCategories(item.id)
        }
        else {
            this.handleSelectedImagesForCurrentCategory(item)
        }
    }

    handleBackpress = () => {
        const { screenType } = this.state
        if (screenType == 'Categories') {
            this.props.navigation.goBack()
        }
        else {
            this.toggleScreenType()
        }
    }
    pushCurrentImagesToMainList = () => {
        const { selectedImagesForCurrentCategory, selectedImagesListForResults } = this.state;
        const newlist = selectedImagesListForResults.concat(selectedImagesForCurrentCategory)
        this.setState({ selectedImagesListForResults: newlist })
        this.toggleScreenType()
    }
    handleSubmit = async () => {
        try {
            this.setState({ isLoading: true })
            let userId = api.currentUser.uid
            let sentence = 'Date now is ' + Date.now()
            let resp = await api.addToHistoryForUser(userId, sentence)
            this.setState({ isLoading: false })
            if (resp) {
                const { selectedImagesListForResults } = this.state;
                this.props.navigation.navigate('Result', { selectedImagesListForResults })
            }
        } catch (error) {
            this.setState({ isLoading: false })
            console.log(error);
        }
    }

    render() {
        const {
            isLoading, screenType, selectedImagesListForResults,
            imagesList, categoriesList, selectedImagesForCurrentCategory
        } = this.state;

        return (
            <Wrapper isLoading={isLoading} contentContainerStyle={styles.outerContainer}>
                <View style={styles.flex1}>
                    <View style={styles.container}>
                        <Text style={styles.headertext}>{screenType}</Text>
                    </View>
                    <View style={styles.flatListContainer}>
                        <FlatList
                            extraData={this.state}
                            columnWrapperStyle={styles.columnWrapperStyle}
                            style={styles.catContainer}
                            contentContainerStyle={styles.categoryImages}
                            numColumns={2}
                            data={screenType == 'Categories' ? categoriesList : imagesList}
                            renderItem={this.categoryImages}
                            keyExtractor={(item, ind) => ind}
                        />
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                    <TransparentButton onPress={this.handleBackpress} title={'< BACK'} />
                    {
                        screenType == 'Categories' ?
                            selectedImagesListForResults.length > 0 && <TransparentButton onPress={this.handleSubmit} title={'GENERATE RESULT'} />
                            :
                            selectedImagesForCurrentCategory.length > 0 && <TransparentButton onPress={this.pushCurrentImagesToMainList} title={'SELECT IMAGES'} />
                    }
                </View>
            </Wrapper>
        );
    }
    categoryImages = ({ item }) => {
        const { screenType, selectedImagesForCurrentCategory } = this.state
        return (
            <>
                <TouchableOpacity onPress={() => this.handleItemPress(item)} style={styles.item}>
                    <Image style={styles.catItemImage} source={{ uri: item.url }} />
                    {
                        screenType !== 'Categories' && selectedImagesForCurrentCategory.find(val => val.id == item.id) &&
                        <Icon type='MaterialCommunityIcons' name='check-circle' style={styles.checkIcon} />
                    }
                    <Text numberOfLines={1} style={styles.categoryLabels}>{item?.name?.toUpperCase()}</Text>
                </TouchableOpacity>
            </>
        );
    }
}

const styles = StyleSheet.create({
    iconContainer: {
        borderRadius: 100, borderWidth: 0
    },
    checkIcon: {
        color: '#5D4242', fontSize: 40,
        position: 'absolute', right: -10, bottom: 10,
    },
    flex1: { flex: 1 },
    columnWrapperStyle: {
        justifyContent: 'space-between'
    },
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
    emptySpace: {
        height: 6,
    },
    item: {
        marginTop: 10,
    },
    textFonts: {
        borderRadius: 25,
        color: '#e67300',
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        borderColor: '#5D4242',
        borderWidth: 3,
        width: (34 / 100) * width,
        padding: 15,
        marginHorizontal: 10,
        paddingVertical: 25,
    },
    catItemImage: {
        width: (34 / 100) * width,
        height: (34 / 100) * width,
        borderRadius: 25,
        overflow: 'hidden',
        borderColor: '#5D4242',
        borderWidth: 3,
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
    catContainer: {
        // backgroundColor: 'yellow',

    },
    categoryImages: {
        // height: (65 / 100) * height,
        // justifyContent: 'space-evenly',

        // alignSelf: 'center',
        // backgroundColor: 'red', 
        paddingHorizontal: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTopWidth: 0,
    },
    categoryLabels: {
        color: '#5D4242',
        textAlign: 'center',
        marginBottom: 10,
        width: (28 / 100) * width,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 3,
        fontWeight: 'bold',
    },
});
