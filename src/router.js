import React from 'react';
import { Button } from 'react-native';
import {
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ThemeColors from './styles/colors'
import api from './api';
import { showMessage } from 'react-native-flash-message';

import Login from './components/screens/Login';
import MainMenu from './components/screens/MainMenu';
import Categories from './components/screens/Categories';
import ResetPassword from './components/screens/ResetPassword';
import Register from './components/screens/Register';
import Result from './components/screens/Result';
import Settings from './components/screens/Settings';
import History from './components/screens/History';
import Options from './components/screens/Options';
import AddImage from './components/screens/AddImage';
import EditDeleteImage from './components/screens/EditDeleteImage';
import BackButton from './components/shared/BackButton';
import { signOutApp } from './auth';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


export const SignedOutStack = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        title: 'Login',
      },
    },
    Register: {
      screen: Register,
      navigationOptions: {
        title: 'Join',
      },
    },
    ResetPassword: {
      screen: ResetPassword,
      navigationOptions: {
        title: 'Reset Password',
      },
    },
  },
  {
    navigationOptions: ({ navigation }) => ({

      headerStyle: {
        backgroundColor: '#ffffff',
        elevation: null,
      },
      headerTintColor: '#16a085',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }),
  },
);

export const SignedInStack = createStackNavigator(
  {
    MainMenu: {
      screen: MainMenu,
      navigationOptions: {
        title: 'Menu',
      },
    },
    Categories: {
      screen: Categories,
      navigationOptions: {
        title: 'Categories',
      }
    },
    Result: {
      screen: Result,
      navigationOptions: {
        title: 'Result',
      }
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        title: 'Settings',
      }
    },
    History: {
      screen: History,
      navigationOptions: {
        title: 'History',
      }
    },
    Options: {
      screen: Options,
      navigationOptions: {
        title: 'Options',
      }
    },
    AddImage: {
      screen: AddImage,
      navigationOptions: {
        title: 'AddImage',
      }
    },
    EditDeleteImage: {
      screen: EditDeleteImage,
      navigationOptions: {
        title: 'EditDeleteImage',
      }
    },
  }, {
  defaultNavigationOptions: {
    header: null
  }
}
  // {
  //   navigationOptions: ({ navigation }) => ({
  //     headerStyle: {
  //       backgroundColor: '#ffffff',
  //       elevation: null,
  //       paddingLeft: 10,
  //       paddingRight: 10,
  //     },
  //     headerTintColor: '#16a085',
  //     headerTitleStyle: {
  //       fontWeight: 'bold',
  //     },
  //     headerLeft: <BackButton navigation={navigation} />,
  //     headerRight: (
  //       <Button
  //         primary
  //         title="Logout"
  //         color="#16a085"
  //         onPress={() => {
  //           api.signOutFirebase()
  //             .then(
  //               () => {
  //                 signOutApp().then(() => navigation.navigate('SignedOutStack', {
  //                   messageProps: {
  //                     title: 'Bye-Bye',
  //                     body: 'Talk to you later!',
  //                     type: 'warning',
  //                   },
  //                 }));
  //               },
  //               (error) => {
  //                 showMessage({
  //                   message: 'Uh-oh',
  //                   description: `${error.message} (${error.code})`,
  //                   type: 'danger',
  //                 });
  //               },
  //             );
  //         }}
  //       >
  //         Log out
  //       </Button>
  //     ),
  //   }),
  // },
);

export const createRootNavigator = (signedIn = false) => createSwitchNavigator(
  {
    SignedInStack: {
      // screen: TabScreens,
      screen: SignedInStack,
    },
    SignedOutStack: {
      screen: SignedOutStack,
    },
  },
  {
    initialRouteName: signedIn ? 'SignedInStack' : 'SignedOutStack',
  },
);
export const AppContainer = (signedIn) => createAppContainer(createRootNavigator(signedIn));
