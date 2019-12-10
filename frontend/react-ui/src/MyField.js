import React from 'react';
import Typography from '@material-ui/core/Typography';

class MyField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      label: null,
      value: null,
    };
  }

  render() {
    return (
      <div>
        <Typography component='p'>{this.props.label}</Typography>
        <Typography color='textSecondary' component='p'>{this.props.value}</Typography>
      </div>
    );
  }
}

export default MyField;