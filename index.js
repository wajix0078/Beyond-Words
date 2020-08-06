import React from 'react';
import { View, Text } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { createRootNavigator, AppContainer } from './router';
import { isSignedIn } from './auth';
import { Provider } from 'react-redux';
import { store } from './redux'
import Wrapper from './components/screens/Wrapper';
import { setAppConfig, getAppConfig, getAppLocalConfig } from './lib/appConfig'
import en from '../assets/languages/en.json'
import ur from '../assets/languages/ur.json'
import i18n from 'i18n-js'
i18n.locale = "en";
i18n.defaultLocale = "en";
i18n.fallback = true;
i18n.translations = {
  en,
  ur
}
// Don't show message that debugger will make app load slower
console.ignoredYellowBox = ['Remote debugger'];
console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false,
    };
  }
  async componentDidMount() {
    try {
      await getAppLocalConfig()
    } catch (error) {
      console.log('setAppConfig() error:', error)
    }
    isSignedIn()
      .then(async (response) => {
        console.log('response>>>>', response)
        this.setState({ signedIn: response, checkedSignIn: true })
      })
      .catch(err => alert('An error occurred:', err));
  }
  render() {
    const { checkedSignIn, signedIn } = this.state;
    if (!checkedSignIn) {
      return <View />
    }
    const Layout = AppContainer(signedIn);
    return (
      <Provider store={store}>
        <ErrorBoundary>
          <View style={{ flex: 1 }}>
            <Layout />
            {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
            <FlashMessage
              position="top"
              duration={5000}
            />
          </View>
        </ErrorBoundary>
      </Provider>
    );
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCrash: false
    }
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ isCrash: true })
    console.error(
      ':::::::::::::::::::::::::::::::::::::APP CRASHED:::::::::::::::::::::::::::::::::',
      error,
      { extra: errorInfo },
      ':::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
    );
  }
  render() {
    const { children } = this.props;
    if (this.state.isCrash) {
      return <Wrapper contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white' }}>App Crashed</Text>
      </Wrapper>;
    }
    return children;

  }
}
