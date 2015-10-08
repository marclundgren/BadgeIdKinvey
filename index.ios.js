'use strict';

var React = require('react-native');
var Kinvey = require('./lib/kinvey');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  WebView,
  ActivityIndicatorIOS,
} = React;

var TEMP_QR_CODE_URL = 'http://i.imgur.com/fc8Xnfq.png';

// var LoginView = require('./App/Views/Login');

var NetworkImage = React.createClass({
  watchID: (null: ?number),

  getInitialState: function() {
    return {
      error: false,
      loading: false,
      progress: 0
    };
  },
  render: function() {
    var loader = this.state.loading ?
      <View style={styles.progress}>
        <Text>{this.state.progress}%</Text>
        <ActivityIndicatorIOS style={{marginLeft:5}}/>
      </View> : null;
    return this.state.error ?
      <Text>{this.state.error}</Text> :
      <Image
        source={this.props.source}
        style={[styles.base, {overflow: 'visible'}]}
        onLoadStart={(e) => this.setState({loading: true})}
        onError={(e) => this.setState({error: e.nativeEvent.error, loading: false})}
        onProgress={(e) => this.setState({progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total)})}
        onLoad={() => this.setState({loading: false, error: false})}>
        {loader}
      </Image>;
  }
});

var BadgeIdKinvey = React.createClass({
  getDefaultProps: function() {
    return {
      appKey: 'kid_W1ipX3lEDe',
      appSecret: '5b1d0379cee44a07a1a2a24198a4833a',
      badgeTitle: 'Empoyee ID'
    };
  },

  getInitialState: function() {
    return {
      authenticated: false,
      name: '',
      email: '',
      photo: null,
      authenticatedAsAdmin: false,
      kinvey: '',

      url: 'https://m.facebook.com',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: false,
      companyName: '',
      role: '',
      signingUp: false,
      signupName: ''
    };
  },

  fetchPhoto: function(options) {

    console.log('fetching photo...');

    var request = {
      // host: 'baas.kinvey.com',
      namespace: 'blob',
      id: options.photoId
    };

    return Kinvey.Persitence.Net.read(request, options);
  },

  showSignUp: function() {
    console.log('clicked sign up')
    this.setState({
      signingUp: true
    });
  },

  showLogin: function() {
    this.setState({
      signingUp: false
    });
  },

  cancelSignUp: function() {
    console.log('clicked sign in from sign up')
    this.setState({
      signingUp: false
    });
  },

  signUp: function() {
    var self = this;
    console.log('clicked sign up...');

    Kinvey.User.signup({
      username: this.state.username,
      password: this.state.password,
      name: this.state.signupName,
      companyName: this.state.companyName,
    })
    .then(function(user) {
      console.log('signed up user!', user);
      self.showLogin();
    }).catch(function(error) {
      console.log('sign up error: ', error);
    });
  },
  logIn: function() {
    var self = this;

    // var {username, password} = this.state;
    console.log('clicked logIn...');


    Kinvey.User.login(this.state.username, this.state.password)
    .then(function(response) {
      console.log('response', response);

      console.log('fetch this photo id', response.photoId);

      console.log('=======')

      console.log(JSON.stringify(response));

      console.log('=======')

      var request = {
        namespace: 'blob',
        id: response.photoId
      };


      // Kinvey.File.stream(response.photoId)
      // .then(function(file) {
      //   self.setState({
      //     photo: file._downloadURL,
      //     username: '',
      //     password: '',
      //   });

      // })
      // .catch(function(err) {
      //   console.log(err);
      // });

      // test
      console.log('querying for Bilbo Baggins...');
      var query = new Kinvey.Query();
      query.equalTo('name', 'Bilbo');
      debugger
      Kinvey.User.find(query, {
        discover : true
      }).then(function(user) {
        console.log('found user!', user);
      })
      .catch(function(error) {
        console.log('unable to find that user', error);
      });

      self.setState({
        name: response.name,
        companyName: response.companyName,
        role: response.role,
        // photo: response.photo,
        clearance: response.clearance,
        authenticated: true
      });
    })
    .catch(function(error) {
      console.log('login error: ', error);
    });

  },

  logOut: function() {
    var self = this;

    Kinvey.User.logout().then(function() {
      self.setState({
        authenticated: false
      });
    })
  },

  componentDidMount: function() {
    var self = this;

    Kinvey.appKey = this.props.appKey;
    Kinvey.appSecret = this.props.appSecret;

    Kinvey.init({
      appKey: Kinvey.appKey,
      appSecret: Kinvey.appSecret
    })

    // to make this faster...

    // log in as a user
    .then(function() {
      self.setState({
        username: 'tom',
        password: 'test'
      })
      self.logIn();
    });



    // sign up
  },

  renderLogout: function() {
    return (
      <TouchableHighlight onPress={() => this.logOut()}>
        <Text>
          Log out
        </Text>
      </TouchableHighlight>
    );
  },

  onNavigationStateChange: function(navState) {
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      url: navState.url,
      status: navState.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  },

  renderBadge: function() {

    // http://p-fst1.pixstatic.com/5069d2d0d9127e30e40007b1._w.1500_s.fit_.jpg

    var photo = this.state.photo || 'https://images.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fthin-users-people%2F57%2Fthin-191_user_profile_avatar-512.png&f=1';

    return (

      <View style={styles.loginContainer}>
        <View style={styles.badgeTitle}>
          <Text style={styles.badgeTitleText}> {this.state.companyName} </Text>
        </View>

        <View style={styles.name}>
          <Text style={styles.nameText}> {this.state.name} </Text>
        </View>

        <View style={styles.role}>
          <Text style={styles.roleText}> {this.state.role} </Text>
        </View>

        <View style={styles.profilePhotoQrContainer}>
          <View style={styles.profilePhoto}>
            <Image style={styles.profilePhotoImage} source={{uri: photo}} />
          </View>

        </View>

        <View style={styles.forgotContainer}>
          <Text style={styles.greyFont}> {this.state.clearance ? 'Security Clearance Code:' + this.state.clearance : ''} </Text>
        </View>

        <TouchableHighlight onPress={() => this.logOut()} style={styles.signin}>
          <Text style={styles.whiteFont}>Sign Out</Text>
        </TouchableHighlight>
      </View>
    );

    // return (
    //   <View style={styles.container}>

    //     <View>
    //       <Text>
    //         Name: {this.state.name}
    //       </Text>
    //     </View>

    //     <NetworkImage stye={styles.photo} source={{uri: this.state.photo}}/>

    //     <View>
    //       <Text>
    //         Clearance: {this.state.clearance}
    //       </Text>
    //     </View>

    //     <View>
    //       <Text>
    //         Placeholder: {this.state.username}QR Code
    //       </Text>
    //     </View>

    //     {this.renderLogout()}


    //   </View>
    // );
  },

  _renderLoginInner: function() {
    var usernameReturnKeyType = 'next';
    var passwordReturnKeyType = 'go';

    var usernameEntered = (this.state.username);
    var passwordEntered = (this.state.password);
    var usernameAndPasswordEntered = (usernameEntered && passwordEntered);

    if (usernameAndPasswordEntered) {
      usernameReturnKeyType = 'go';
    }

    return (
      <View style={styles.logginInner}>
          <View style={styles.loginHeader}>
            <Image style={styles.loginMark} source={{uri: 'http://i.imgur.com/da4G0Io.png'}} />
          </View>

          <View style={styles.inputs}>
            <View style={styles.inputContainer}>
              <Image style={styles.inputUsername} source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>

              <TextInput
                autoCorrect={false}
                style={[styles.input, styles.whiteFont]}
                placeholder="Username"
                placeholderTextColor="#FFF"
                onChangeText={(text) => this.setState({username: text})}
                value={this.state.username}

                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={true}
                returnKeyType={usernameReturnKeyType}
              />
            </View>

            <View style={styles.inputContainer}>
              <Image style={styles.inputPassword} source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>

              <TextInput
                password={true}
                style={[styles.input, styles.whiteFont]}
                placeholder="Pasword"
                placeholderTextColor="#FFF"
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}

                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={true}
                returnKeyType={passwordReturnKeyType}
              />
            </View>

            <View style={styles.forgotContainer}>
              <Text style={styles.greyFont}>Forgot Password</Text>
            </View>
          </View>

          <TouchableHighlight onPress={() => this.logIn()} style={styles.signin}>
            <Text style={styles.whiteFont}>Sign In</Text>
          </TouchableHighlight>

          <TouchableOpacity onPress={() => this.showSignUp()} style={styles.signup}>
            <Text style={styles.greyFont}>Dont have an account?
            <Text style={styles.whiteFont}>  Sign Up</Text></Text>
          </TouchableOpacity>
        </View>
    );
  },

  _renderSignUpInner: function() {
    var usernameReturnKeyType = 'next';
    var passwordReturnKeyType = 'go';

    var usernameEntered = (this.state.username);
    var passwordEntered = (this.state.password);
    var usernameAndPasswordEntered = (usernameEntered && passwordEntered);

    if (usernameAndPasswordEntered) {
      usernameReturnKeyType = 'go';
    }

    return (
      <View style={styles.logginInner}>
          <View style={styles.loginHeader}>
            <Image style={styles.loginMark} source={{uri: 'http://i.imgur.com/da4G0Io.png'}} />
          </View>

          <View style={styles.inputs}>
            <View style={styles.inputContainer}>
              <Image style={styles.inputUsername} source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>

              <TextInput
                autoCorrect={false}
                style={[styles.input, styles.whiteFont]}
                placeholder="Username"
                placeholderTextColor="#FFF"
                onChangeText={(text) => this.setState({username: text})}
                value={this.state.username}

                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={true}
                returnKeyType={usernameReturnKeyType}
              />
            </View>

            <View style={styles.inputContainer}>
              <Image style={styles.inputPassword} source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>

              <TextInput
                password={true}
                style={[styles.input, styles.whiteFont]}
                placeholder="Pasword"
                placeholderTextColor="#FFF"
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}

                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={true}
                returnKeyType={passwordReturnKeyType}
              />
            </View>

            <View style={styles.inputContainer}>
              <Image style={styles.inputUsername} source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>

              <TextInput
                style={[styles.input, styles.whiteFont]}
                placeholder="Your Name"
                placeholderTextColor="#FFF"
                onChangeText={(text) => this.setState({signupName: text})}
                value={this.state.signupName}

                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={true}
              />
            </View>

            <View style={styles.inputContainer}>
              <Image style={styles.inputUsername} source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>

              <TextInput
                style={[styles.input, styles.whiteFont]}
                placeholder="Your Company (optional)"
                placeholderTextColor="#FFF"
                onChangeText={(text) => this.setState({companyName: text})}
                value={this.state.companyName}

                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={true}
              />
            </View>

          </View>

          <TouchableHighlight onPress={() => this.signUp()} style={styles.signin}>
            <Text style={styles.whiteFont}>Sign Up</Text>
          </TouchableHighlight>

          <TouchableOpacity onPress={() => this.showLogin()} style={styles.signup}>
            <Text style={styles.greyFont}>Already have an account?
            <Text style={styles.whiteFont}> Sign in </Text></Text>
          </TouchableOpacity>
        </View>
    );
  },

  renderLogin: function() {

    return (
      <View style={styles.loginContainer}>
        <Image style={styles.loginBg} source={{uri: 'http://i.imgur.com/xlQ56UK.jpg'}} />

        {this.state.signingUp ? this._renderSignUpInner() : this._renderLoginInner()}
      </View>
    );
  },

  render: function() {

    if (this.state.authenticated) {
      if (this.state.authenticatedAsAdmin) {
        return this.renderScanner();
      }

      return this.renderBadge();
    }

    return this.renderLogin();
  }
});

var styles = StyleSheet.create({
  form: {
    flexDirection: 'column',
    alignItems: 'center'
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 5,
  },

  toolbar:{
    backgroundColor:'#81c04d',
    paddingTop:30,
    paddingBottom:10,
    flexDirection:'row'
  },
  toolbarButton:{
    width: 50,
    color:'#fff',
    textAlign:'center'
  },
  toolbarTitle:{
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    flex:1
  },

  content:{
      backgroundColor:'#ebeef0',
      flex:1
  },

  // webView: {
    // backgroundColor: 'rgba(255,255,255,0.8)',
    // height: 10,
  // },

  // photo: {
  //   width: 100,
  //   height: 100,
  // },

  base: {
    width: 100,
    height: 100,
  },
  progress: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    width: 100
  },

  profilePlaceholder: {
    width: 100,
    height: 100,
    // border: 1,
    borderRadius: 50,
    // borderColor: '#666',
    backgroundColor: '#eee',
  },

  loginButton: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },

  loginContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'transparent'
  },
  loginBg: {
      backgroundColor: '#f1f1f1',
      position: 'absolute',
      left: 0,
      top: 0,
      width: windowSize.width,
      height: windowSize.height
  },
  profilePhotoQrContainer: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2.5,
    // backgroundColor: 'red',
    // borderRadius: 10
  },
  profilePhoto: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 0.5,
    // backgroundColor: 'red',
    // borderRadius: 10
  },
  profilePhotoImage: {
    backgroundColor: 'transparent',
    borderRadius: 75,
    width: 150,
    height: 150
    // justifyContent: 'center',
    // alignItems: 'center',
    // flex: 2,
    // backgroundColor: 'red',
    // borderRadius: 10
  },
  qrContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1.5,
    backgroundColor: 'transparent'
  },
  qr: {
    // backgroundColor: 'red',
    // borderRadius: 10
    // justifyContent: 'center',
    // alignItems: 'center',
    // flex: 1.5,
    // backgroundColor: 'transparent'
  },

  loginHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: .4,
    backgroundColor: 'transparent'
  },
  badgeTitle: {
    justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 10,
    flex: .5,
    backgroundColor: 'transparent'
  },
  badgeTitleText: {
    fontSize: 30,
    color: '#666',
  },
  companyName: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: .5,
    backgroundColor: 'transparent'
  },
  name: {
    // justifyContent: 'center',
    alignItems: 'center',
    // flex: .5,
    // backgroundColor: 'transparent'
  },
  nameText: {
    fontSize: 20
  },
  role: {
    // justifyContent: 'center',
    alignItems: 'center',
    // flex: .5,
    // backgroundColor: 'transparent'
  },
  roleText: {
    fontSize: 16
  },
  loginMark: {
      width: 150,
      height: 150
  },
  signin: {
      backgroundColor: '#5c89a8',
      padding: 20,
      alignItems: 'center'
  },
  signup: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: .10
  },
  inputs: {
      marginTop: 10,
      marginBottom: 10,
      flex: .25
  },
  inputPassword: {
      marginLeft: 15,
      width: 20,
      height: 21
  },
  inputUsername: {
    marginLeft: 15,
    width: 20,
    height: 20
  },
  inputContainer: {
      padding: 10,
      borderWidth: 1,
      borderBottomColor: '#CCC',
      borderColor: 'transparent'
  },
  input: {
      position: 'absolute',
      left: 61,
      top: 12,
      right: 0,
      height: 20,
      fontSize: 14
  },
  forgotContainer: {
    alignItems: 'flex-end',
    padding: 15,
  },
  greyFont: {
    color: '#D8D8D8'
  },
  whiteFont: {
    color: '#FFF'
  },
  logginInner: {
    flex: 1,
  }
});

AppRegistry.registerComponent('BadgeIdKinvey', () => BadgeIdKinvey);

module.exports = BadgeIdKinvey;
