import React, { Component } from 'react';
import { GridList, Container, IconButton, Avatar, 
  Slide, Dialog, AppBar, Typography, Box, InputBase,
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
      labels: null,
      collection: null,
      dialogOpen: false,
      selectedFood: null,
    };
  }

  loadStorage() {
    fetch(Config.metadataUrl)
    .then(response => response.json())
    .then(remoteMetadata => {
      let storedMetadata = localStorage.getItem(Config.localStoredNutripediaMetadataKey);
      if (storedMetadata == null ||
          typeof storedMetadata === 'undefined' ||
          typeof storedMetadata.lastUpdate === 'undefined' ||
          typeof remoteMetadata.lastUpdate === 'undefined' ||
          (new Date(storedMetadata.lastUpdate)) < (new Date(remoteMetadata.lastUpdate))) {
        fetch(Config.dataUrl)
        .then(response => response.json())
        .then(remoteData => {
          this.setState({collection: remoteData});
          localStorage.setItem(Config.localStoredNutripediaDataKey, JSON.stringify(remoteData));
          this.setState({labels: remoteMetadata});
          localStorage.setItem(Config.localStoredNutripediaMetadataKey, JSON.stringify(remoteMetadata));
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

  foodPicture(index, name, image) {
    const openFood = () => {
      this.setState({selectedFood: this.state.collection.data[index]});
      this.setState({dialogOpen: true});
    }
    return (
      <GridListTile key={'food'+index}>
        <img src={image} alt={name} />
        <GridListTileBar title={name} actionIcon={
          <IconButton onClick={openFood}>
            <InfoIcon className='foodIcon' />
          </IconButton>
        }/>  
    

      </GridListTile>
    );
  }

  foodDialog() {
    const Transition = React.forwardRef(function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
    });
    const handleClose = () => {
      this.setState({selectedFood: null});
      this.setState({dialogOpen: false});
    }
    const labels = this.state.labels;
    const food = this.state.selectedFood;
    let content = [];
    if (food != null) {
      content = (
        <Dialog open={this.state.dialogOpen} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
              <Typography>{food.name}</Typography>
            </Toolbar>
          </AppBar>
          <Container>
            <Field label={labels.properties} value={food.properties} />
            <Field label={labels.benefits} value={food.benefits} />
            <Field label={labels.composition} value={food.composition} />
            <Field label={labels.action} value={food.action} />
            <Field label={labels.nutrients} value={food.nutrients} />
            <Field label={labels.dailyPortion} value={food.dailyPortion} />
          </Container>
        </Dialog>
      );
    }
    return content;
  }

  searchField() {
    return (
      <Box>
        <SearchIcon />
        <InputBase placeholder='Pesquisar...' />
      </Box>
    );
  }

  appBar() {
    return (
      <AppBar position='static'>
        <Toolbar>
          <Avatar src='./food-icon.png' />
          <Typography noWrap>Nutripedia</Typography>
        </Toolbar>
      </AppBar>
    );
  }

  render() {
    this.loadStorage();
    const collection = this.state.collection;
    let content = [];
    if (collection == null ||
        typeof collection === 'undefined' ||
        typeof collection.data === 'undefined') {
      content = <Typography>Carregando...</Typography>;
    } else {
      content = Object.values(collection.data).map(item =>
        this.foodPicture(item.id, item.name, item.image)
      );
    }
    return (
      <Container maxWidth="md">
        {this.appBar()}
        <GridList cols={3} className="gridList">
          {content}
        </GridList>
        {this.foodDialog()}
      </Container>
    );
  }

}

export default App;
