import React, { Component } from 'react'
import { Container, Header, Content, DatePicker, Text, Form, Item, Input, Button, Picker } from 'native-base'
import AppNavigator from '../navigation/AppNavigator'
import firebase from '../constants/Database'

export default class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '',
            password: '',
            error: '',
            authorized: false
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
            console.info(this.state.error);
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
                    </Content>
                </Container>
            )
        }
    }
}