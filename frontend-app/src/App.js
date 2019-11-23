import React, {Component} from 'react';

class App extends Component {
  
  apiUrl = 'http://localhost:8080/';
  metadataUrl = this.apiUrl + '';
  dataUrl = this.apiUrl + '?data';
    
  state = {
    metadata: [],
    data: []
  };

  localStoredDataKey = '@nutripedia/data';
  localStoredLastUpdateKey = '@nutripedia/lastUpdate';

  updateMetadata() {
    fetch(this.metadataUrl)
    .then(response => response.json())
    .then((content) => {
      this.setState({metadata: content});
    })
    .catch(error => {
      console.error('Failed retrieving information', error);
    })
  }

  updateData() {
    fetch(this.dataUrl)
    .then(response => response.json())
    .then((content) => {
      this.setState({data: content});
    })
    .catch(error => {
      console.error('Failed retrieving information', error);
    })
  }

  updateLocalStorage() {
    localStorage.setItem(this.localStoredLastUpdateKey, this.state.metadata.lastUpdate);
    this.updateData();
    localStorage.setItem(this.localStoredDataKey, JSON.stringify(this.state.data));
  }

  checkLastUpdate() {
    let storedlastUpdate = localStorage.getItem(this.localStoredLastUpdateKey);
    if (storedlastUpdate == null || typeof storedlastUpdate === 'undefined') {
      this.updateLocalStorage();
    } else {
      let localDate = new Date(storedlastUpdate);
      let remoteDate = new Date(this.state.metadata.lastUpdate);
      if (localDate <= remoteDate) {
        this.updateLocalStorage();
      }
    }
  }

  createCard(food) {
    let label = this.state.metadata;
    return (
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">{food.name}</h3>
          <img src={food.image} alt={food.image} className="img-thumbnail" />
          <h4 className="card-subtitle mb-2">{label.properties}</h4>
          <h5 className="card-subtitle mb-2 text-muted">{food.properties}</h5>
          <h4 className="card-subtitle mb-2">{label.benefits}</h4>
          <h5 className="card-subtitle mb-2 text-muted">{food.benefits}</h5>
          <h4 className="card-subtitle mb-2">{label.composition}</h4>
          <h5 className="card-subtitle mb-2 text-muted">{food.composition}</h5>
          <h4 className="card-subtitle mb-2">{label.action}</h4>
          <h5 className="card-subtitle mb-2 text-muted">{food.action}</h5>
          <h4 className="card-subtitle mb-2">{label.nutrients}</h4>
          <h5 className="card-subtitle mb-2 text-muted">{food.nutrients}</h5>
          <h4 className="card-subtitle mb-2">{label.dailyPortion}</h4>
          <h5 className="card-subtitle mb-2 text-muted">{food.dailyPortion}</h5>
        </div>
      </div>);
  }

  getContent() {
    let content = '';
    let collection = JSON.parse(localStorage.getItem(this.localStoredDataKey));
    if (collection == null ||
        typeof collection === 'undefined' ||
        typeof collection.data === 'undefined') {
      content = <h5 className="card-subtitle mb-2 text-muted">Food not found.</h5>;
    } else {
      for(let food in Object.values(collection.data)) {
        content += this.createCard(food);
      }
    }
    return content;
  }
  
  render() {
    this.updateMetadata();
    this.checkLastUpdate();
    let content = this.getContent();
    return (
      <div className="container">
        <div className="col-xs-12">
          <h1>NutriPedia</h1>
          <img src='https://raw.githubusercontent.com/jonatascbarroso/nutripedia/master/food-icon.png' alt='NutriPedia' className="img-thumbnail" />
          {content}
        </div>
      </div>
    );
  }
}

export default App;
