'use strict';

import React, { Component } from 'react';
import ReactNative from 'react-native';
import Image from 'react-native-image-progress';
import Progress from 'react-native-progress';
// import GridView from 'react-native-gridview'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

const firebase = require('firebase');
const styles = require('./styles.js')


const {
  AppRegistry,
  ListView,
  StyleSheet,
  View,
  TouchableHighlight,
  Alert,
  Dimensions
} = ReactNative;

const deviceWidth = Dimensions.get('window').width;

const firebaseConfig = {
  apiKey: "AIzaSyCUob810PNlKg4syL2nk-esvNx-F8G15aE",
  authDomain: "alkitab-suara.firebaseapp.com",
  databaseURL: "https://alkitab-suara.firebaseio.com",
  storageBucket: "alkitab-suara.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  // Initialize Firebase
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = this.getRef().child('listenmenu');
  }
  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          image_url: child.val().image_url,
          color: child.val().color,
          art: child.val().art,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }


  componentDidMount() {
    console.log(this.state.dataSource)
    this.listenForItems(this.itemsRef);
  }

  render() {
    return (
      <View style={styles.cardContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          numberOfItemsPerRow={2}
          removeClippedSubviews={false}
          initialListSize={1}
          pageSize={2} />

      </View>
    )
  }

  _addItem() {
    Alert.alert(
      'Alert Title',
      'My Alert Msg',
      [
        { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'OK', onPress: () => {
            this.itemsRef.push({ title: "text" })
          }
        },
      ],
      { cancelable: false }
    );
  }

  _renderItem(item) {
    const onPress = () => {
      Alert.alert(
        'Complete',
        null,
        [
          { text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove() },
          { text: 'Cancel', onPress: (text) => console.log('Cancelled') }
        ]
      );
    };

    return (
      <View style={styles.item}>
        <Container>
          <Content>
            <TouchableHighlight>
              <Card style={{
                backgroundColor: item.color
              }}>
                <CardItem
                  cardBody
                  style={{ flex: 1 }}>
                  <Image
                    source={{ uri: item.image_url }}
                    style={{
                      width: null,
                      height: deviceWidth / 2,
                      alignSelf: 'stretch',
                      flex: 1
                    }}
                    resizeMode={'stretch'} />
                </CardItem>
                <CardItem style={{ backgroundColor: item.color }}>
                  <Left>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: 'white'
                      }}>{item.title}</Text>
                  </Left>
                  <Right>
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'white'
                      }}>{item.art} Pasal</Text>
                  </Right>
                </CardItem>
              </Card>
            </TouchableHighlight>
          </Content>
        </Container>
      </View>
    );
  }
}


