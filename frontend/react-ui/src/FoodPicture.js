import React from 'react';
import { IconButton, GridListTile, GridListTileBar } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

class FoodPicture extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: null,
      image: null
    }
  }

  render() {
    return (
      <GridListTile className='foodPictureFrame'>
        <img src={this.props.image} alt={this.props.name} className='foodImage' />
        <GridListTileBar title={this.props.name} actionIcon={
          <IconButton><InfoIcon className='foodIcon' /></IconButton>
        }/>
      </GridListTile>
    );
  }
}

export default FoodPicture;