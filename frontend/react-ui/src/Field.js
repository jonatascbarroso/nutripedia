import React from 'react';
import { Typography, Box, Divider } from '@material-ui/core';

class Field extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      label: null,
      value: null,
    };
  }

  render() {
    return (
      <Box>
        <Divider />
        <Typography component="h3" className="propertyLabel">
          {this.props.label}
        </Typography>
        <Typography component="p" className="propertyValue">{this.props.value}</Typography>
      </Box>
    );
  }
}

export default Field;