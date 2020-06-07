import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import ThemeColors from './../../styles/colors'
import { getAppConfig } from '../../lib/appConfig';

const Button = ({ style, textStyle, onPress, children, }) => {
  const styles = createStyles();
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  )
};
export const RoundButton = ({ style, textStyle, onPress, children, innerViewStyles }) => {
  const styles = createStyles();
  return (
    <TouchableOpacity
      style={[styles.roundButtonStyles, style]}
      onPress={onPress}
    >
      <View style={innerViewStyles}>
        <Text style={[styles.rountButtonText, textStyle]}>{children}</Text>
      </View>

    </TouchableOpacity>
  )
};
export const Button2 = ({ style, textStyle, onPress, children, }) => {
  const styles = createStyles();
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  )
};

export const TransparentButton = ({ onPress = () => { }, title, }) => {
  const styles = createStyles();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.transparentButton}>
      <Text style={styles.transparentButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const createStyles = () => {
  let config = getAppConfig()
  let { appFontFamily, appFontSize, appImageSize, appLanguage, appPrimaryColor, appSecondaryColor } = config
  return StyleSheet.create({
    button: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: 15,
    },
    buttonText: {
      textAlign: 'center',
      color: '#FFF',
      fontWeight: '700',
    },
    roundButtonStyles: {
      backgroundColor: appPrimaryColor,
      borderRadius: 100,
      height: 80,
      alignItems: 'center',
      justifyContent: 'center'
    },
    rountButtonText: {
      textAlign: 'center',
      color: appSecondaryColor,
      // fontWeight: 'bold',
    },
    transparentButton: {
      borderColor: appPrimaryColor,
      borderWidth: 2,
      // width: (20 / 100) * width,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      borderRadius: 5,
      // alignSelf: 'flex-start',
    },
    transparentButtonText: {
      fontSize: 20,
      color: appPrimaryColor
    },
  })
};

export default Button;
