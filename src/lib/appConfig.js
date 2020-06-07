import { AsyncStorage } from 'react-native'
import { colorSet } from '../styles/colors'
const CONFIG_KEY = "APPCONFIG"

class configurations {
    constructor() {
        this.config = {
            appFontSize: 1,
            appFontFamily: 'Roboto',
            appPrimaryColor: colorSet.col1.primaryColor,
            appSecondaryColor: colorSet.col1.secondaryColor,
            appImageSize: 1,
            appLanguage: 'EN'
        }
    }
    async getLocalConfig() {
        let config = await AsyncStorage.getItem(CONFIG_KEY)
        if (config !== null) {
            this.config = JSON.parse(config)
            return this.config
        }
        else {
            console.log('No configuration file found on device!')
            return false
        }
    }
    getConfig() {
        return this.config;
    }
    async setConfig(newConfig) {
        try {
            await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig))
            this.config = newConfig;
            return true;
        } catch (error) {
            console.log('setConfig error:', error.message)
            return false;
        }
    }
}
const appConfig = new configurations
export const getAppLocalConfig = async () => await appConfig.getLocalConfig()
export const getAppConfig = () => appConfig.getConfig()
export const setAppConfig = async (newConfig) => await appConfig.setConfig(newConfig) 
