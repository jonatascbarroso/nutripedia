import React, { Component } from 'react';
import { GridList, Container, IconButton, Avatar, Paper,
  Dialog, AppBar, Typography, Box, InputBase,
  GridListTile, GridListTileBar, Toolbar } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import Field from './Field';
import Config from './Config';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openedDialog: false,
      selectedFood: null,
    };
  }
  
  getLocalStoredMetadata() {
    return JSON.parse(localStorage.getItem(Config.localStoredNutripediaMetadataKey));
  }

  getLocalStoredData() {
    return JSON.parse(localStorage.getItem(Config.localStoredNutripediaDataKey));
  }

  setLocalStoredData(data) {
    localStorage.setItem(Config.localStoredNutripediaDataKey, JSON.stringify(data));
  }
  
  setLocalStoredMetadata(metadata) {
    localStorage.setItem(Config.localStoredNutripediaMetadataKey, JSON.stringify(metadata));
  }

  updateLocalStorage(metadata, data) {
    this.setLocalStoredData(data);
    this.setLocalStoredMetadata(metadata);
  }

  updateLocalStorageWithRemoteData() {
    fetch(Config.metadataUrl)
    .then(response => response.json())
    .then(remoteMetadata => {
      let storedMetadata = this.getLocalStoredMetadata();
      if (storedMetadata == null ||
          typeof storedMetadata === 'undefined' ||
          (new Date(storedMetadata.lastUpdate)) < (new Date(remoteMetadata.lastUpdate))) {
        fetch(Config.dataUrl)
        .then(response => response.json())
        .then(remoteData => this.updateLocalStorage(remoteMetadata, remoteData))
        .catch(error => {
          console.error('Failed retrieving data.', error);
        });
      }
    })
    .catch(error => {
      console.error('Failed retrieving metadata.', error);
    });
  }

  foodCard(index, name, image) {
    const openDialog = () => {
      const food = this.getLocalStoredData().data[index];
      this.setState({selectedFood: food});
      this.setState({openedDialog: true});
    }
    return (
      <GridListTile key={'food'+index} className="foodCard"
        onClick={openDialog}>
        <img src={image} alt={name} />
        <GridListTileBar title={name} actionIcon={
          <IconButton onClick={openDialog}>
            <InfoIcon className='foodIcon' />
          </IconButton>
        }/>
      </GridListTile>
    );
  }

  foodDialog() {
    const closeDialog = () => {
      this.setState({selectedFood: null});
      this.setState({openedDialog: false});
    }
    const labels = this.getLocalStoredMetadata();
    const food = this.state.selectedFood;
    let content = [];
    if (food != null) {
      content = (
        <Dialog fullScreen
          open={this.state.openedDialog} onClose={closeDialog}>
          <AppBar>
            <Toolbar className="toolbar">
              <IconButton edge="start" color="inherit" onClick={closeDialog}>
                <CloseIcon />
              </IconButton>
              <Typography component="h2" noWrap className="appTitle">
                {food.name}
              </Typography>
            </Toolbar>
          </AppBar>
          <Paper className="foodDialogContainer">
            <GridList cellHeight={'auto'} cols={1}>
              <GridListTile>
                <img src={food.image} alt={food.name} />
              </GridListTile>
            </GridList>
            <Field label={labels.properties} value={food.properties} />
            <Field label={labels.benefits} value={food.benefits} />
            <Field label={labels.composition} value={food.composition} />
            <Field label={labels.action} value={food.action} />
            <Field label={labels.nutrients} value={food.nutrients} />
            <Field label={labels.dailyPortion} value={food.dailyPortion} />
          </Paper>
        </Dialog>
      );
    }
    return content;
  }

  searchField() {
    return (
      <Box className="searchBox">
        <SearchIcon />
        <InputBase placeholder='Pesquisar...' className="inputBase" />
      </Box>
    );
  }

  appBar() {
    return (
      <AppBar position='static'>
        <Toolbar className="toolbar">
          <Avatar src='./food-icon.png' />
          <Typography noWrap component="h1" className="appTitle">Nutripedia</Typography>
          
        </Toolbar>
      </AppBar>
    );
  }

  render() {
    this.updateLocalStorageWithRemoteData();
    const collection = this.getLocalStoredData();
    let content = [];
    if (collection == null ||
        typeof collection === 'undefined' ||
        typeof collection.data === 'undefined') {
      content = <Typography>Carregando...</Typography>;
    } else {
      content = Object.values(collection.data).map(item =>
        this.foodCard(item.id, item.name, item.image)
      );
    }
    return (
      <Container maxWidth="md">
        {this.appBar()}
        <GridList cols={3} className="cardList">
          {content}
        </GridList>
        {this.foodDialog()}
      </Container>
    );
  }

}

export default App;
