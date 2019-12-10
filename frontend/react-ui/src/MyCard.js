import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import MyField from './MyField';

class MyCard extends React.Component {

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
            <MyField label={labels.properties} value={data.properties} />
            <MyField label={labels.benefits} value={data.benefits} />
            <MyField label={labels.composition} value={data.composition} />
            <MyField label={labels.action} value={data.action} />
            <MyField label={labels.nutrients} value={data.nutrients} />
            <MyField label={labels.dailyPortion} value={data.dailyPortion} />
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default MyCard;