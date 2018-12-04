import React, { Component } from 'react'
import { Container, Header, Content, DatePicker, Text, Form, Item, Input, Button, Picker } from 'native-base'
import AppNavigator from '../navigation/AppNavigator'
import firebase from '../constants/Database'
import * as Firebase from 'firebase'
import Expo from 'expo'

export default class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '',
            password: '',
            error: '',
            authorized: false,
            responseJSON: null,
        }
    }
    setEmail(email) {
        this.setState({ 
            email: email  
        })
    }
    setPassword(password) {
        this.setState({ 
            password: password
        })
    }
    state = {
        responseJSON: null,
    } 
    callGraph = async token => {
        const response = await fetch(
            `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture`
        );
        const responseJSON = JSON.stringify(await response.json());
        this.setState({ responseJSON });
    }
    login = async () => {
        const {
            type,
            token,
        } = await Expo.Facebook.logInWithReadPermissionsAsync('2047203438692373', {
            permissions: ['public_profile', 'email', 'user_friends'],
        });

        if (type === 'success') {
            this.callGraph(token);

            this.firebaseLogin(token);
        }
    }
    firebaseLogin = token => {
        const credential = Firebase.auth.FacebookAuthProvider.credential(token)

        firebase.auth().signInAndRetrieveDataWithCredential(credential)
        .then(() => { 
            this.setState({ error: '', authorized: true }) 
        })
        .catch((error) => {
            console.error('firebase facebook auth error:', error)
        })
    }
    signIn(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => { 
            this.setState({ error: '', authorized: true })
        })
        .catch(() => {
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => { 
                this.setState({ error: '', authorized: true }) 
            })
            .catch(() => {
                this.setState({ error: 'Authentication failed.', authorized: false })
            })
        })
    }
    render() {
        if (this.state.authorized) {
            return (
              <AppNavigator />
            );
        } else {
            return (
                <Container>
                    <Header />
                    <Content>
                        <Form>
                            <Item>
                                <Input 
                                    onChangeText={(email) => this.setEmail(email)} 
                                    value={this.state.email} 
                                    placeholder="Email"
                                />
                            </Item>
                            <Item>
                                <Input 
                                    onChangeText={(password) => this.setPassword(password)}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                />
                            </Item>
                            
                        </Form>
                        <Button 
                            full={true} 
                            rounded={true} 
                            bordered={false} 
                            small={true} 
                            onPress={() => this.signIn(this.state.email, this.state.password)}
                        >
                            <Text>Sign-In</Text>
                        </Button>
                        <Button 
                            full={true} 
                            rounded={true} 
                            bordered={false} 
                            small={true} 
                            onPress={() => this.login()}
                        >
                            <Text>Facebook Login</Text>
                        </Button>
                    </Content>
                </Container>
            )
        }
    }
}