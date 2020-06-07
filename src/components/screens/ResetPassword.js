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
import Button from './..//shared/Button';
import { connect } from 'react-redux';
// import TextInput from './../shared/TextInput';
import IconTitleSet from './../shared/IconTitleSet';
import validateForm from './../../helpers/validation';
import Wrapper, { AuthWrapper } from './Wrapper';
import { get } from 'lodash';
// import { Icon } from 'react-native-elements';
import firebase from './../../lib/firebase';
import { signInApp } from '../../auth';
import ThemeColors from './../../styles/colors'
import AppConstants from './../../helpers/constants'
import api from './../../api';
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
    isLoading: false,
  };

  runValidation = () => {
    const { email } = this.state;

    const fields = [
      {
        value: email,
        verify: [
          {
            type: 'isPopulated',
            message: 'Please enter your email address',
          },
          {
            type: 'isEmail',
            message: 'Please format your email address correctly',
          },
        ],
      },
    ];

    const errorMessage = validateForm(fields);
    if (errorMessage) {
      showMessage({
        message: 'Check your form',
        description: errorMessage,
        type: 'danger',
      });

      return false;
    }

    return true;
  }

  sendPasswordResetEmail = () => {
    const { email } = this.state;

    const isFormValid = this.runValidation();
    if (!isFormValid) {
      return;
    }

    this.setState({ isLoading: true });

    api.sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ isLoading: false });
        this.props.navigation.navigate('Login', {
          messageProps: {
            title: 'Your mail is on its way',
            body: 'Check your inbox for your reset email',
            type: 'warning',
          },
        });
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
          <Text style={styles.pageHeading}>RESET PASSWORD</Text>
        </View>
        <View style={[styles.textInputContainer]}>
          <Icon style={styles.icon} name='ios-mail' />
          <TextInput
            placeholderTextColor={getAppConfig().appPrimaryColor}
            style={styles.textinput}
            placeholder="Email Address"
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
        </View>

        <View style={styles.submitButtonContainer}>
          <Button style={styles.submitButton} textStyle={styles.submitButtonText} onPress={this.sendPasswordResetEmail}>SUBMIT</Button>
        </View>

        <View style={styles.linksContainer}>
          <Button onPress={() => this.props.navigation.navigate('Login')} textStyle={styles.linksText} style={styles.links} >
            Login
                  </Button>
          <Button onPress={() => this.props.navigation.navigate('Register')} textStyle={styles.linksText} style={styles.links}>
            Register
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
      backgroundColor: appSecondaryColor,
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
      fontSize: 25 * appFontSize,
      fontFamily: appFontFamily,
      fontWeight: 'bold',
      color: appPrimaryColor,
    },
    icon: {
      color: appPrimaryColor,
      paddingHorizontal: 10,
      fontSize: 30 * appFontSize,
      fontFamily: appFontFamily,
      width: 40
    },
    submitButtonContainer: {
      marginTop: 15,
    },
    submitButtonText: {
      color: appSecondaryColor,
      fontSize: 25 * appFontSize,
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
    // ImageBackgroundStyle: {
    //   flex: 1,
    //   width: AppConstants.screenWidth,
    //   height: AppConstants.screenHeight,
    //   alignItems: 'center',
    // },
    // emptyView: { height: 30 },
    // header: {
    //   backgroundColor: appPrimaryColor,
    //   width: AppConstants.screenWidth - 30,
    //   height: AppConstants.screenHeight / 3,
    //   resizeMode: 'center',
    //   borderRadius: 60, overflow: 'hidden'
    // },

    // pageHeading:{ color: 'white', marginTop: 15, fontSize: 20, fontWeight: 'bold', textAlign:'center' },
    // content: {
    //   // marginTop: 50,
    //   borderRadius: 60, overflow: 'hidden',
    //   backgroundColor: appSecondaryColorRgba + '0.5)',
    //   alignItems: 'center',
    //   paddingBottom: 50
    // },

    // textInputContainer: {
    //   marginTop: 15,
    //   width: AppConstants.screenWidth - 60,
    //   height: 40,
    //   borderRadius: 60,
    //   flexDirection: 'row',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   backgroundColor: '#fff',
    //   paddingHorizontal: 15
    // },
    // textinput: {
    //   flex: 1,
    //   backgroundColor: 'transparent',
    //   paddingHorizontal: 5,
    // },
    // icon: {
    //   paddingHorizontal: 10,
    //   fontSize: 20,
    //   width: 30
    // },
    // submitButtonContainer: {
    //   marginTop: 15,
    // },
    // submitButton: {
    //   width: AppConstants.screenWidth - 60,
    //   borderRadius: 60,
    //   height: 40,
    //   padding: 0,
    //   justifyContent: 'center',
    //   backgroundColor: appSecondaryColor
    // },
    // linksContainer: {
    //   marginTop: 15
    // },
    // links: {
    //   backgroundColor: 'transparent',
    //   padding: 5
    // },
    // linksText: {
    //   color: appPrimaryColor,
    // }
  })
}

// import React, { Component } from 'react';
// import {
//   StyleSheet,
//   View,
// } from 'react-native';
// import { showMessage } from 'react-native-flash-message';

// import Button from './../shared/Button';
// import TextInput from './../shared/TextInput';
// import IconTitleSet from './../shared/IconTitleSet';
// import Wrapper from './Wrapper';

// import api from './../../api';
// import validateForm from './../../helpers/validation';

// export default class ResetPassword extends Component {
//   state = {
//     email: '',
//     isLoading: false,
//   };

//   runValidation = () => {
//     const { email } = this.state;

//     const fields = [
//       {
//         value: email,
//         verify: [
//           {
//             type: 'isPopulated',
//             message: 'Please enter your email address',
//           },
//           {
//             type: 'isEmail',
//             message: 'Please format your email address correctly',
//           },
//         ],
//       },
//     ];

//     const errorMessage = validateForm(fields);
//     if (errorMessage) {
//       showMessage({
//         message: 'Check your form',
//         description: errorMessage,
//         type: 'danger',
//       });

//       return false;
//     }

//     return true;
//   }

//   sendPasswordResetEmail = () => {
//     const { email } = this.state;

//     const isFormValid = this.runValidation();
//     if (!isFormValid) {
//       return;
//     }

//     this.setState({ isLoading: true });

//     api.sendPasswordResetEmail(email)
//       .then(() => {
//         this.setState({ isLoading: false });
//         this.props.navigation.navigate('Login', {
//           messageProps: {
//             title: 'Your mail is on its way',
//             body: 'Check your inbox for your reset email',
//             type: 'warning',
//           },
//         });
//       })
//       .catch((error) => {
//         showMessage({
//           message: 'Check your form',
//           description: `${error.message} (${error.code})`,
//           type: 'danger',
//         });
//         this.setState({
//           isLoading: false,
//         });
//       });
//   }

//   render() {
//     return (
//       <Wrapper isLoading={this.state.isLoading}>
//         <View style={styles.container}>
//           <IconTitleSet
//             iconName="mail"
//             iconSize={100}
//             iconColor="#bdede3"
//             style={styles.iconTitleSet}
//           >
//             Send Reset Email
//           </IconTitleSet>
//           <TextInput
//             placeholder="Email Address"
//             keyboardType="email-address"
//             value={this.state.email}
//             onChangeText={email => this.setState({ email })}
//           />
//           <Button onPress={this.sendPasswordResetEmail}>RESET PASSWORD</Button>
//         </View>
//       </Wrapper>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 80,
//   },
//   iconTitleSet: {
//     marginBottom: 20,
//   },
// });
