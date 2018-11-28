import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { ExpoLinksView } from '@expo/samples'
import firebase from '../constants/Database'
import { Container, Header, Content, List, ListItem, Text, Body, Right } from 'native-base'

export default class ExpensesScreen extends React.Component {
  static navigationOptions = {
    title: 'Expenses',
  };

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      entries: []
    }
  }
  setLoaded(loaded) {
    this.setState({ loaded })
  }
  setEntries(entries) {
    this.setState({ entries })
  }

  componentDidMount() {
    const self = this,
      dates = [];

    if (firebase.auth().currentUser !== null) {
        const uid = firebase.auth().currentUser.uid

        firebase.database().ref('expenses/' + uid).once('value', function(snapshot) {
            
            snapshot.forEach(function(childSnapshot) {
              var childSnapshotData = childSnapshot.val()
              dates.push(childSnapshotData.date)
            })

            if (dates.length) {
              self.setEntries(dates)
            }
        })
        
    } else {
      console.error('ExpensesScreen: componentDidMount else')
    }
  }

  render() {
    return (
      <Container>
        <Header />
        <Content>
          <List dataArray={this.state.entries}
            renderRow={(item) =>
              <ListItem>
                <Body>
                  <Text>{item}</Text>
                </Body>
                <Right>
                  <Text>$10</Text>
                </Right>
              </ListItem>
            }>
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  }
})
