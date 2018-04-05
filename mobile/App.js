import React, { Component } from 'react';
import { Text, View, TouchableHighlight,StyleSheet, Alert, Switch, Image, Button } from 'react-native';
import { BarCodeScanner, Permissions, Facebook , Google} from 'expo';
import { Card } from 'react-native-elements'; // Version can be specified in package.json
import SimpleStatusBar from './components/SimpleStatusBar';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import * as firebase from 'firebase';

import config from './config';

if (!firebase.apps.length) {
    firebase.initializeApp(config.firebase);
}

const delay = (time) => {
  return new Promise(function(resolve, reject) {
    setTimeout(() => resolve(), time);
  });
}

export default class App extends Component {
  state = {
    hasCameraPermission: null,
    inputValue: "",
    cameraSwitch: false,
    enableCheckin: false,
    userId: "",
    qr: "",
    userName: "",
    count: 0,
    loggedIn: false
  };
  
  componentWillMount() {
    firebase.database().ref('/event/' + config.eventId).on('value', snapshot => {
      let count = snapshot.val().count;
      this.setState({ count });
    });
  }

  componentDidMount() {
    this._requestCameraPermission();
  }
  
  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };
  
  _count = () => this.state.count;
  
  _loginState = () => this.state.loggedIn;
  
  _enableScanner = () => this.state.cameraSwitch;
  
  _disableCheckIn = () => !this.state.loggedIn;
  
  _googleLogin = async () => {
    try {
      const { type, user } = await Google.logInAsync(config.google);

      switch (type) {
        case 'success': {
          Alert.alert( 'Logged in!', `Hi  ${user.id} ${user.name}!` );
          
          this.setState({
            userId: user.id,
            userName: user.name,
            loggedIn: true,
          });
          
          break;
        }
        case 'cancel':
          Alert.alert( 'Cancelled!', 'Login was cancelled!' );
          break;
        default:
          Alert.alert( 'Oops!', 'Login failed!');
          break;
      }
    } catch (e) {
      Alert.alert(
        'Oops!',
        'Login failed!',
      );
    }
  };
  
  _facebookLogin = async () => {
    const options = { permissions: ['public_profile'] };
    
    const { type, token } = await Facebook.logInWithReadPermissionsAsync('218412742068883', options);
    
    if (type === 'success') {
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      const fbResponse = (await response.json());
      
      this.setState({
        userId: fbResponse.id,
        userName: fbResponse.name,
        loggedIn: true,
      });
    }
  }
  
  _increaseLoginAttempt = (eventId) => {
    const fb = firebase.database().ref('/event/'+eventId);
    fb.child('count').transaction(function(currentValue) {
        return (currentValue||0) + 1
    });
  };
  
  _checkIn = (eventId,userId,name) =>{
      firebase.database().ref('event/' + eventId + '/users/' + userId).set({
        name: name,
        id: userId
      });
  };
  
  _handleBarCodeRead = async (obj) => {
    await delay(500);
    
    if (this.state.qr != obj.data) {
      const eventData = JSON.parse(obj.data);
      
      this.setState({ qr: obj.data });
      this._increaseLoginAttempt(eventData.id);
      this._checkIn(eventData.id, this.state.userId, this.state.userName);
    }
  };
  
  _handleToggleSwitch = () => this.setState(state => ({
    cameraSwitch: !state.cameraSwitch
  }));
  
  _checkInTitle = () => {
    return this.state.loggedIn ? "Check In" : "Please login to check in"
  }
  
  render() {
    return (
      <View style={styles.container}>
        <AppHeader />
        <View style={styles.row}>
            <View style={[styles.box, styles.box2, styles.boxItem]}>
              <View style={[styles.row, styles.boxItem2]}>
                  <View style={{alignItems: "center", flex:1}}>
                    <Image style={styles.scannerIcon} source={require('./assets/qr.png')}/>
                  </View>
                  <View style={{ alignItems: "center", flex:1}}>
                    <Switch
                        onValueChange={this._handleToggleSwitch}
                        value={this.state.cameraSwitch}
                        />
                  </View>
              </View>
            </View>
            <View style={[styles.box, styles.two, styles.boxItem2]}>
                {
                  this._loginState()?
                  <Text>{this.state.userName}</Text>:
                  <TouchableHighlight onPress={this._googleLogin}>
                    <Image
                      style={styles.loginIcon}
                      source={require('./assets/facebook.png')}
                    />
                  </TouchableHighlight>
                }
            </View>
        </View>
        <View style={styles.body}>
            {!this._enableScanner() ?
                <View></View> :
                <Card style={styles.card}>
                <BarCodeScanner
                  onBarCodeRead={this._handleBarCodeRead}
                  style={styles.barcode}
                />
                <Button
                  disabled={this._disableCheckIn()}
                  title={this._checkInTitle()}
                  style={{ backgroundColor: "blue"}}
                  onPress={this._handleButtonPress}
                />
                <Text>{this._count()}</Text>
                </Card>
            }
        </View>
        <AppFooter />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  card: {
    flex: 1,
    width: "100%"
  },
  barcode: {
    height: 350, 
    width: "100%",
  },
  body: {
      flex: 10
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7
  },
  scannerIcon: {
    width: 30,
    height: 30
  },
  loginIcon: {
    width: 250,
    height: 40
  },
  box: {
    flex: 1,
    height: 50,
    backgroundColor: '#70a6ff',
  },
  two: {
    flex: 2
  },
  boxItem: {
      justifyContent: 'center',
      alignItems: 'center'
  },
  boxItem2: {
      justifyContent:'space-between',
      margin: 0,
      alignItems: 'center',
  }
});
