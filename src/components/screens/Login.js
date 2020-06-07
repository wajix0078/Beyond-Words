import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TextInput
} from 'react-native';
import { Container, Icon } from 'native-base'
import { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import Button from './..//shared/Button';
import validateForm from './../../helpers/validation';
import Wrapper, { AuthWrapper } from './Wrapper';
import { get } from 'lodash';
import firebase from './../../lib/firebase';
import { signInApp } from '../../auth';
import ThemeColors from './../../styles/colors'
import AppConstants from './../../helpers/constants'
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
class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: '',
    password: '',
    isLoading: false,
  };

  onLoginPress = () => {
    const { email, password } = this.state;
    this.setState({ isLoading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.setState({ isLoading: false });
        signInApp().then(() => this.props.navigation.navigate('SignedInStack'));
      })
      .catch((error) => {
        showMessage({
          message: 'Check your form',
          description: `(${error.code})\n${error.message}`,
          type: 'danger',
        });
        this.setState({
          isLoading: false,
        });
      });
  }

  render() {
    const styles = createStyles();
    return (
      <Wrapper isLoading={this.state.isLoading} contentContainerStyle={styles.container}>
        <View style={{ width: '100%', paddingHorizontal: 30 }}>
          <Text style={styles.pageHeading}>LOGIN</Text>
        </View>
        <View style={[styles.textInputContainer]}>
          <Icon style={styles.icon} name='ios-mail' />
          <TextInput
            style={styles.textinput}
            placeholder="Email Address"
            keyboardType='email-address'
            autoCapitalize='none'
            placeholderTextColor={getAppConfig().appPrimaryColor}
            value={this.state.email}
            blurOnSubmit={false}
            onSubmitEditing={() => this.passwordInput.focus()}
            onChangeText={email => this.setState({ email })}
          />
        </View>
        <View style={[styles.textInputContainer]}>
          <Icon style={styles.icon} name='lock' />
          <TextInput
            style={styles.textinput}
            placeholder="Password"
            returnKeyType="go"
            placeholderTextColor={getAppConfig().appPrimaryColor}
            secureTextEntry
            value={this.state.password}
            ref={(input) => { this.passwordInput = input; }}
            onChangeText={password => this.setState({ password })}
          />
        </View>

        <View style={styles.submitButtonContainer}>
          <Button style={styles.submitButton} textStyle={styles.submitButtonText} onPress={this.onLoginPress}>SUBMIT</Button>
        </View>

        <View style={styles.linksContainer}>
          <Button onPress={() => this.props.navigation.navigate('Register')} textStyle={styles.linksText} style={styles.links} >
            Don't have an account? Register here
                  </Button>
          <Button onPress={() => this.props.navigation.navigate('ResetPassword')} textStyle={styles.linksText} style={styles.links}>
            Reset password
                  </Button>
        </View>
      </Wrapper>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
const createStyles = () => {
  let config = getAppConfig()
  let { appFontFamily, appFontSize, appImageSize, appLanguage, appPrimaryColor, appSecondaryColor } = config
  return StyleSheet.create({
  container: {
    backgroundColor: appSecondaryColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ImageBackgroundStyle: {
    width: AppConstants.screenWidth,
    height: AppConstants.screenHeight / 3,
  },
  emptyView: { height: 30 },
  header: {
    backgroundColor: appPrimaryColor,
    width: AppConstants.screenWidth - 30,
    height: AppConstants.screenHeight / 3,
    resizeMode: 'center',
    borderRadius: 60, overflow: 'hidden'
  },
  pageHeading: { color: appPrimaryColor, marginTop: 15, fontSize: 25, fontWeight: 'bold', textAlign: 'center' },
  content: {
    borderRadius: 60, overflow: 'hidden',
    backgroundColor: ThemeColors.secondaryColorRgba + '0.5)',
    alignItems: 'center',
    paddingBottom: 50
  },

  textInputContainer: {
    borderWidth: 2,
    borderColor: appPrimaryColor,
    marginTop: 15,
    width: AppConstants.screenWidth - 60,
    height: 60,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appSecondaryColor,
    paddingHorizontal: 15
  },
  textinput: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 5,
    fontSize: 25*appFontSize,
    fontFamily: appFontFamily,
    fontWeight: 'bold',
    color: appPrimaryColor,
  },
  icon: {
    color: appPrimaryColor,
    paddingHorizontal: 10,
    fontSize: 30*appFontSize,
    fontFamily: appFontFamily,
    width: 40
  },
  submitButtonContainer: {
    marginTop: 15,
  },
  submitButtonText: {
    color: appSecondaryColor,
    fontSize: 25*appFontSize,
    fontFamily: appFontFamily,
    fontWeight: 'bold'
  },
  submitButton: {
    width: AppConstants.screenWidth - 60,
    borderRadius: 60,
    height: 40,
    padding: 0,
    justifyContent: 'center',
    backgroundColor: appPrimaryColor
  },
  linksContainer: {
    marginTop: 15
  },
  links: {
    backgroundColor: 'transparent',
    padding: 5
  },
  linksText: {
    color: appPrimaryColor,
  }
})




{/* <View style={styles.container}>
          <IconTitleSet
            iconName="chat"
            iconSize={100}
            iconColor="#bdede3"
            style={styles.iconTitleSet}
          >
            Chat-a-lot
          </IconTitleSet>
          <KeyboardAvoidingView style={styles.loginformContainer}>
            <TextInput
              placeholder="Email Address"
              onSubmitEditing={() => this.passwordInput.focus()}
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
            <TextInput
              placeholder="Password"
              returnKeyType="go"
              secureTextEntry
              ref={(input) => { this.passwordInput = input; }}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
            <Button onPress={this.onLoginPress}>LOGIN</Button>
          </KeyboardAvoidingView>
          <Button
            onPress={() => this.props.navigation.navigate('Register')}
            style={styles.signUpButton}
          >
            Sign up
          </Button>
          <Button onPress={() => this.props.navigation.navigate('ResetPassword')}>Reset Password</Button>
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  iconTitleSet: {
    marginBottom: 20,
  },
  loginformContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  signUpButton: {
    marginBottom: 10,
  },
}); */}}

