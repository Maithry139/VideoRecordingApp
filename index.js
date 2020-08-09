import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SplashScreen from './Screens/SplashScreen';
import RecordVideo from './Screens/RecordVideo';


const HomeNavigator = createStackNavigator(
    {
        
      
        'RecordVideo': {screen: RecordVideo},
       
    
    });

    const AppSwitchNavigator = createSwitchNavigator({
        'SplashScreen': { screen: SplashScreen },
        'RecordVideo': { screen: RecordVideo },
    },
    {
        initialRouteName: 'SplashScreen',


    });
const Index = createAppContainer(AppSwitchNavigator);
export default Index;


