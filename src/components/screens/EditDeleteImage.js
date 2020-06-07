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
import { connect } from 'react-redux';
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
class EditDeleteImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            flowType: this.props.navigation.getParam('flowType'), //EDIT or DELETE
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
    getUploadedImagesByCategoriesAndUserId = (catId) => {
        this.setState({ isLoading: true })
        let userId = api.currentUser.uid;
        api.getUploadedImagesByCategoriesAndUserId(userId, catId)
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
    handleItemPress = async (item) => {
        const { screenType } = this.state
        if (screenType == 'Categories') {
            this.toggleScreenType()
            this.getUploadedImagesByCategoriesAndUserId(item.id)
        }
        else {
            this.deleteImage(item)
        }
    }
    getFilename(url) {
        if (url) {
            let fileName_Index = url.lastIndexOf("/") + 1,
                fileName = url.substr(fileName_Index);
            return fileName.replace(/[\#\?].*$/, '');
        }
        return "";
    }
    deleteImage = async (item) => {
        try {
            this.setState({ isLoading: true })
            let fileName = this.getFilename(item.url)
            console.log(fileName)
            let storageResp = await api.deleteImageFromStorage(fileName)
            if (storageResp) {
                let deleteImageDataResp = await api.deleteImageById(item.id)
                if (deleteImageDataResp) {
                    const { imagesList } = this.state;
                    const newImageList = imagesList.filter(v => v.id !== item.id)
                    this.setState({ isLoading: false, imagesList: newImageList })
                }
                else {
                    this.setState({ isLoading: false })
                }
            }
            else {
                this.setState({ isLoading: false })
            }
        }
        catch (e) {
            this.setState({ isLoading: false })
            console.log(e);
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
            flowType, isLoading, screenType, selectedImagesListForResults,
            imagesList, categoriesList, selectedImagesForCurrentCategory
        } = this.state;
        const styles = createStyles();
        return (
            <Wrapper isLoading={isLoading} contentContainerStyle={styles.outerContainer}>
                <View style={styles.flex1}>
                    <View style={styles.container}>
                        <Text style={styles.headertext}>{flowType} IMAGE</Text>
                        <Text style={[styles.headertext, styles.headerSubText]}>Select {screenType}</Text>
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
        const styles = createStyles();
        const { screenType, flowType } = this.state
        return (
            <>
                <TouchableOpacity
                    onPress={
                        () => {
                            flowType == 'EDIT' && screenType !== 'Categories' ?
                                this.props.navigation.navigate('AddImage', { item })
                                :
                                this.handleItemPress(item)
                        }
                    }
                    style={styles.item}>

                    <Image style={styles.catItemImage} source={{ uri: item.url }} />
                    {
                        screenType !== 'Categories' ?
                            <View style={styles.iconContainer}>
                                <Icon
                                    name={flowType == 'DELETE' ? 'delete-forever' : 'square-edit-outline'}
                                    type='MaterialCommunityIcons'
                                    style={styles.checkIcon} />
                            </View>
                            : null
                    }

                    <Text numberOfLines={1} style={styles.categoryLabels}>{item?.name?.toUpperCase()}</Text>

                </TouchableOpacity>
            </>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditDeleteImage);
const createStyles = () => {
    let config = getAppConfig()
    let { appFontFamily, appFontSize, appImageSize, appLanguage, appPrimaryColor, appSecondaryColor } = config
    return StyleSheet.create({
        iconContainer: {
            borderRadius: 100, borderWidth: 0,
            backgroundColor: appPrimaryColor,
            width: 40, height: 40,
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            position: 'absolute', right: -10, bottom: 10,
        },
        checkIcon: {
            color: appSecondaryColor,
            fontSize: 25 * appFontSize,
            fontFamily: appFontFamily,
            alignSelf: 'center'
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
            backgroundColor: appSecondaryColor
        },
        container: {
            justifyContent: 'space-evenly',
            borderRadius: 25,
            borderWidth: 0,
            marginTop: 20,
            backgroundColor: appPrimaryColor,
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
            fontSize: 25 * appFontSize,
            fontFamily: appFontFamily,
            textAlign: 'center',
            borderColor: appPrimaryColor,
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
            borderColor: appPrimaryColor,
            borderWidth: 3,
        },
        headertext: {
            color: appSecondaryColor,
            fontWeight: 'bold',
            fontSize: 40 * appFontSize,
            fontFamily: appFontFamily,
            textAlign: 'center',
        },
        headerSubText: {
            fontSize: 18 * appFontSize,
            fontFamily: appFontFamily,
        },
        flatListContainer: {
            flex: 1,
            paddingTop: 5,
            borderBottomWidth: 1,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            borderColor: appPrimaryColor,
            borderWidth: 3 / 2,
            marginTop: -6,
            marginHorizontal: 30,
            overflow: 'hidden'
        },
        catContainer: {

        },
        categoryImages: {
            paddingHorizontal: 10,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderTopWidth: 0,
        },
        categoryLabels: {
            color: appPrimaryColor,
            textAlign: 'center',
            marginBottom: 10,
            width: (28 / 100) * width,
            borderRadius: 10,
            alignSelf: 'center',
            marginTop: 3,
            fontSize:12*appFontSize, 
            fontFamily: appFontFamily,
            fontWeight: 'bold',
        },
    })
};
