import React, { Component } from 'react';
import MyCard from './MyCard';
import { AppBar, Toolbar, Grid, Avatar, Typography, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

class App extends Component {

  apiUrl = 'http://192.168.1.16:8080/';
  metadataUrl = this.apiUrl + '';
  dataUrl = this.apiUrl + '?data';
  localStoredNutripediaDataKey = '@nutripedia/data';
  localStoredNutripediaMetadataKey = '@nutripedia/metadata';

  createCard(data) {
    let labels = JSON.parse(localStorage.getItem(this.localStoredNutripediaMetadataKey));
    return (
      <Grid container item xs={12} sm={4}>
        <MyCard labels={labels} data={data} />
      </Grid>
    );
  }

  loadStorage() {
    fetch(this.metadataUrl)
    .then(response => response.json())
    .then(remoteMetadata => {
      let storedMetadata = localStorage.getItem(this.localStoredNutripediaMetadataKey);
      if (storedMetadata == null ||
          typeof storedMetadata === 'undefined' ||
          typeof storedMetadata.lastUpdate === 'undefined' ||
          typeof remoteMetadata.lastUpdate === 'undefined' ||
          (new Date(storedMetadata.lastUpdate)) < (new Date(remoteMetadata.lastUpdate))) {
        fetch(this.dataUrl)
        .then(response => response.json())
        .then(remoteData => {
          localStorage.setItem(this.localStoredNutripediaDataKey, JSON.stringify(remoteData));
          localStorage.setItem(this.localStoredNutripediaMetadataKey, JSON.stringify(remoteMetadata));
        })
        .catch(error => {
          console.error('Failed retrieving data', error);
        });
      }
    })
    .catch(error => {
      console.error('Failed retrieving metadata', error);
    });
  }

  render() {
    this.loadStorage();
    let collection = JSON.parse(localStorage.getItem(this.localStoredNutripediaDataKey));
    let content = [];
    if (collection == null ||
        typeof collection === 'undefined' ||
        typeof collection.data === 'undefined') {
      content = (<p>Data not found.</p>);
    } else {
      Object.values(collection.data)
      .forEach(item => {
        content.push(this.createCard(item));
      })
    }
    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
            <Avatar src='https://raw.githubusercontent.com/jonatascbarroso/nutripedia/master/food-icon.png' />
            <Typography className='App-title' noWrap>Nutripedia</Typography>
            <div className='App-search'>
              <div className='App-searchIcon'>
                <SearchIcon />
              </div>
              <InputBase placeholder='Pesquisar...' classes={{
                root: 'App-inputRoot',
                input: 'App-inputInput',
              }} inputProps={{'aria-label': 'search'}} />
            </div>
          </Toolbar>
        </AppBar>
        <Grid container>
          {content}
        </Grid>
      </div>
    );
  }

}

export default App;
