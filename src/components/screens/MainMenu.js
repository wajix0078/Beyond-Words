import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
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

mapStateToProps = (state) => {
  const { auth } = state;
  return { auth }
}

mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: (user) => { dispatch(signIn(user)) }
  }
}
class MainMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isUserProfileLoaded: false
    }
  }
  getUserProfile = async () => {
    api.getCurrentUser().then((user) => {
      this.props.onSignIn(user);
    })
  }
  async componentDidMount() {
    this.getUserProfile()
  }
  static navigationOptions = {
    headerLeft: null,
  };
  render() {
    // const { isUserProfileLoaded } = this.state;
    // if (!isUserProfileLoaded) {
    //   return <Wrapper isLoading />
    // }
    console.log(this.props.auth)
    return (
      <Wrapper>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#00796B" />
          <View style={styles.imageContainer}>
            <Image resizeMode='contain' style={styles.imageStyles} source={require('./../../../assets/images/beyondWords.png')} />
          </View>
          <View style={styles.row}>
            <RoundButton
              textStyle={styles.buttonText}
              innerViewStyles={styles.roundButtonInnerView}
              onPress={() => { this.props.navigation.navigate('Categories') }}
              style={styles.RoundButton}
            >
              START
          </RoundButton>
            <RoundButton
              textStyle={styles.buttonText}
              innerViewStyles={styles.roundButtonInnerView}
              onPress={() => { this.props.navigation.navigate('Settings') }}
              style={styles.RoundButton}
            >
              SETTING
          </RoundButton>
          </View>

          <View style={styles.row}>
            <RoundButton
              textStyle={styles.buttonText}
              innerViewStyles={styles.roundButtonInnerView}
              onPress={() => { this.props.navigation.navigate('History') }}
              style={styles.RoundButton}
            >
              HISTORY
          </RoundButton>
            <RoundButton
              innerViewStyles={styles.roundButtonInnerView}
              onPress={() => { this.props.navigation.navigate('Options') }}
              textStyle={styles.buttonText}
              style={styles.RoundButton}
            >
              OPTIONS
          </RoundButton>
          </View>
          <View style={styles.row}>
            <RoundButton
              textStyle={styles.buttonText}
              innerViewStyles={styles.roundButtonInnerView}
              onPress={() => signOutUser(this.props.navigation)}
              style={styles.RoundButton}
            >
              LOGOUT
          </RoundButton>

          </View>
        </View>
      </Wrapper>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  imageStyles: {
    width: width * 83 / 100,
  },
  container: {
    flex: 1,
    paddingTop: 40,
  },
  iconTitleSet: {
    marginBottom: 20,
  },
  RoundButton: {
    marginBottom: 10,
    width: width * 44.97 / 100,
    height: width * 44.97 / 100
  },
  buttonText: { fontSize: 25, fontWeight: 'bold' },
  roundButtonInnerView: {
    borderColor: ThemeColors.backgroundColor, borderWidth: 2, borderRadius: 100,
    width: width * 44.97 / 100 - 5,
    height: width * 44.97 / 100 - 5,
    justifyContent: 'center'
  },
  welcomeText: { color: 'white', fontSize: 20, textAlign: 'center', flex: 1, },
  nameText: { color: 'white', fontSize: 20, paddingHorizontal: 5 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});




