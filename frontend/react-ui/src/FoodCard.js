import React from 'react';
import { IconButton, Typography, Card,
  CardActionArea, CardContent, CardMedia } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CardField from './CardField';

class FoodCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      labels: null,
      data: null,
    };
  }

  render() {
    let labels = this.props.labels;
    let data = this.props.data;

    return (
      <Card>
        <CardActionArea>
          <CardMedia image={data.image} title={data.name} />
          <CardContent>
            <Typography component='h2'>{data.name}</Typography>
            <CardField label={labels.properties} value={data.properties} />
            <CardField label={labels.benefits} value={data.benefits} />
            <CardField label={labels.composition} value={data.composition} />
            <CardField label={labels.action} value={data.action} />
            <CardField label={labels.nutrients} value={data.nutrients} />
            <CardField label={labels.dailyPortion} value={data.dailyPortion} />
          </CardContent>
        </CardActionArea>
        <IconButton><CloseIcon /></IconButton>
      </Card>
    );
  }
}

export default FoodCard;