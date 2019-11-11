import React, {Component} from 'react';

class App extends Component {
  
  apiUrl = 'http://localhost:8080/';
  metadataUrl = this.apiUrl + '';
  dataUrl = this.apiUrl + '?data';
    
  state = {
    metadata: [],
    data: []
  }

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
    if (storedlastUpdate == null || storedlastUpdate === 'undefined') {
      this.updateLocalStorage();
    } else {
      let localDate = new Date(storedlastUpdate);
      let remoteDate = new Date(this.state.metadata.lastUpdate);
      if (localDate < remoteDate) {
        this.updateLocalStorage();
      }
    }
  }
  
  render() {
    this.updateMetadata();
    this.checkLastUpdate();
    let content = <h5 className="card-subtitle mb-2 text-muted">Food not found.</h5>
    let collection = JSON.parse(localStorage.getItem(this.localStoredDataKey));
    for (let [key, food] of Object.entries(collection)) {
      content =
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">{food.name}</h3>
            <img src={food.image} alt={food.image} className="img-thumbnail" />
            <h4 className="card-subtitle mb-2">{this.state.metadata.properties}</h4>
            <h5 className="card-subtitle mb-2 text-muted">{food.properties}</h5>
            <h4 className="card-subtitle mb-2">{this.state.metadata.benefits}</h4>
            <h5 className="card-subtitle mb-2 text-muted">{food.benefits}</h5>
            <h4 className="card-subtitle mb-2">{this.state.metadata.composition}</h4>
            <h5 className="card-subtitle mb-2 text-muted">{food.composition}</h5>
            <h4 className="card-subtitle mb-2">{this.state.metadata.action}</h4>
            <h5 className="card-subtitle mb-2 text-muted">{food.action}</h5>
            <h4 className="card-subtitle mb-2">{this.state.metadata.nutrients}</h4>
            <h5 className="card-subtitle mb-2 text-muted">{food.nutrients}</h5>
            <h4 className="card-subtitle mb-2">{this.state.metadata.dailyPortion}</h4>
            <h5 className="card-subtitle mb-2 text-muted">{food.dailyPortion}</h5>
          </div>
        </div>
    }
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
