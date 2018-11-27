import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { ExpoLinksView } from '@expo/samples'
import firebase from '../constants/Database'
import { Container, Header, Content, List, ListItem, Text } from 'native-base'

export default class ExpensesScreen extends React.Component {
  static navigationOptions = {
    title: 'Expenses',
  };

  constructor(props) {
    super(props)
    this.state = { 
      entries: []
    }
  }
  setEntries(entries) {
    this.setState({ entries })
  }

  componentDidMount() {
    const self = this
    if (firebase.auth().currentUser !== null) {
        //@todo read expenses using uid as reference
        const uid = firebase.auth().currentUser.uid

        
          console.info('uid: ', uid);
  
          firebase.database().ref('expenses/' + uid)
            .once('value', function(snapshot) {
              console.info(snapshot);
              
              var arr = [];

              // for (var key in myObject) {
              //   arr.push(myObject[key]);
              // }

              snapshot.forEach(function(childSnapshot) {
                console.info('first foreach', childSnapshot);

                console.info('first foreach', snapshot[childSnapshot]);
                childSnapshot.forEach(function(key){
                  console.info('second foreach', childSnapshot[key]);
                  // arr.push(rec);
                })
                
              })

              console.info('getting data:', arr);

              // self.setEntries(arr);

          })

    } else {
      console.info('ExpensesScreen: componentDidMount else');
    }
  }

  render() {
    // let dates = Object.keys(this.state.expenses)

    console.info('render entries', this.state.entries);

    var items = [
      'Simon Mignolet',
      'Nathaniel Clyne',
      'Dejan Lovren',
      'Mama Sakho',
      'Emre Can'
    ];

    return (
      <Container>
        <Header />
        <Content>
          <List dataArray={this.state.entries}
            renderRow={(item) =>
              <ListItem>
                <Text>{item}</Text>
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
  },
});
