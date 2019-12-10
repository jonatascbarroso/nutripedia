import React from 'react';
import { Typography, AppBar, Toolbar,
    Avatar, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
  
class ElevateAppBar extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppBar position='static'>
        <Toolbar>
          <Avatar src='./food-icon.png' />
          <Typography noWrap>Nutripedia</Typography>
          <div>
            <div>
            <SearchIcon />
            </div>
            <InputBase placeholder='Pesquisar...' />
          </div>
        </Toolbar>
      </AppBar>
    );
  }

}

export default ElevateAppBar;