import React, { Component } from 'react';
import { Container, Header, Content, DatePicker, Text, Form, Item, Input, Button, Picker } from 'native-base';
import firebase from '..//constants/Database'

export default class DatePickerExample extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      chosenDate: new Date(),
      categorySelected: 'Miscellaneous',
      price: ''
    };
    this.setDate = this.setDate.bind(this);
  }
  setDate(newDate) {
    this.setState({ 
      chosenDate: newDate  
    })
  }
  setPrice(newPrice) {
    this.setState({
      price: newPrice
    })
  }
  setCategory(category: string) {
    this.setState({
      categorySelected: category
    });
  }
  writeExpensesData(date, category, price){
    firebase.database().ref('expenses/').push({
        date,
        category,
        price
      }).then((data)=>{
        //success callback
        console.log('data ' , data)
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
  }
   render() {
    return (
      <Container>
        <Header />
        <Content>
          <DatePicker
            defaultDate={new Date(2018, 4, 4)}
            minimumDate={new Date(2018, 1, 1)}
            maximumDate={new Date(2018, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select date"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={this.setDate}
            />
            <Text>
              Date: {this.state.chosenDate.toString().substr(4, 12)}
            </Text>
            <Form>
              <Picker
                note
                mode="dropdown"
                style={{ width: 120 }}
                selectedValue={this.state.categorySelected}
                onValueChange={this.setCategory.bind(this)}
              >
                <Picker.Item label="Miscellaneous" value="Miscellaneous" />
                <Picker.Item label="Groceries" value="Groceries" />
                <Picker.Item label="Outing " value="Outing" />
                <Picker.Item label="Car" value="Car" />
                <Picker.Item label="Internet" value="Internet" />
              </Picker>
                <Item>
                    <Input 
                      onChangeText={(price) => this.setPrice(price)} 
                      value={this.state.price} 
                      placeholder="$ Amount"
                    />
                </Item>
                
            </Form>
            <Button 
              full={true} 
              rounded={true} 
              bordered={false} 
              small={true} 
              onPress={() => this.writeExpensesData(this.state.chosenDate.toString().substr(4, 12), this.state.categorySelected, this.state.price)}
            >
                <Text>Add</Text>
            </Button>
        </Content>
      </Container>
    );
  }
}