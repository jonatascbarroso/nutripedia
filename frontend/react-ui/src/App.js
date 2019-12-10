import React, { Component } from 'react';
import FoodCard from './FoodCard';
import FoodPicture from './FoodPicture';
import { GridList } from '@material-ui/core';
import ElevateAppBar from './ElevateAppBar';

class App extends Component {

  apiUrl = 'http://localhost:8080/';
  metadataUrl = this.apiUrl + '';
  dataUrl = this.apiUrl + '?data';
  localStoredNutripediaDataKey = '@nutripedia/data';
  localStoredNutripediaMetadataKey = '@nutripedia/metadata';

  createFoodCard(food) {
    let labels = JSON.parse(localStorage.getItem(this.localStoredNutripediaMetadataKey));
    return (
      <FoodCard labels={labels} data={food} />
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
      content = (<p>Food not found.</p>);
    } else {
      Object.values(collection.data)
      .forEach(item => {
        content.push(<FoodPicture name={item.name} image={item.image} />);
      })
    }
    return (
      <div>
        <ElevateAppBar />
        <GridList className='gridList'>
          {content}
        </GridList>
      </div>
    );
  }

}

export default App;
