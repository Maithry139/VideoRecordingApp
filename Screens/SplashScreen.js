import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

export default class SplashScreen extends Component {
  async componentDidMount() {
   
    const data = await this.navigateToHome();
    if (data !== null) {
    this.props.navigation.navigate('RecordVideo');
    }}
    navigateToHome = async () => {
    // Splash screen will remain visible for 2 seconds
    const wait = time => new Promise((resolve) => setTimeout(resolve, time));
    return wait(3000).then(() => this.props.navigation.navigate('RecordVideo'))
    };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginHorizontal: 40,
        }}>
        <Image
          source={require('../images/source.gif',
          )}
          style={{width: 275, height: 275, marginTop: 200}}
        />
        
          <View style={{ flex: 1,flexDirection: 'column', alignItems: 'center', justifyContent: 'center',}}>
          <Text
            style={{ color: '#114998', fontSize: 25, fontWeight: 'bold',marginTop: 40, width: 450, height: 50}}>
            Video Recorder  
          </Text>
        </View>
       
      </View>
    );
  }
}
