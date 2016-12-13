import React, {PropTypes} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
// import link from '../libs/link';

const brewName = (brew) =>  (brew && ('#' + brew.brewNo + ' ' + brew.name)) || '';

const TapCard = ({tap, brew, weight}) => (
  <Card>
    <CardHeader title={tap.name}/>
    <CardMedia>
      <img src='../images/beer.jpg' />
    </CardMedia>
    <CardTitle title={brewName(brew)} subtitle={brew.style} />
  </Card>
);

TapCard.propTypes = {
  tap: PropTypes.object.isRequired,
  brew: PropTypes.object,
  weight: PropTypes.object,
}

export default TapCard;
