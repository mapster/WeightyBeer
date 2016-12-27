import React, {PropTypes} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {storage} from '../libs/FirebaseApp';

const cardStyle = {
  backgroundColor: '#424242',
};

const brewName = (brew) =>  (brew && brew.name) || '';
const volumeText = (tap, weight) => {
  if(!tap.volume || !weight.percent) {
    return '';
  }
  return '(' + (tap.volume * weight.percent / 100.0).toFixed(2) + '/' + tap.volume + ' L)';
}

const brewImage = (images, brew) => {
  const img = images[brew.image] || {};
  return img.url;
}

const TapCard = ({tap, brew, images, weight}) => (
  <div className='tapCard'>
    <Card style={cardStyle} className='favorite-tap'>
      <CardHeader title={tap.name}/>
      <CardMedia>
        <img className='tapCardImg' src={brewImage(images, brew)} />
      </CardMedia>
      <CardTitle title={brewName(brew)} subtitle={'Brew #' + brew.brewNo + ' - ' + brew.style}>
        <Divider style={{marginTop: '5px', marginBottom: '5px'}} />
        <div>Remaining: {weight.percent}% {volumeText(tap, weight)}</div>
      </CardTitle>
    </Card>
  </div>
);

TapCard.propTypes = {
  tap: PropTypes.object.isRequired,
  brew: PropTypes.object,
  images: PropTypes.object.isRequired,
  weight: PropTypes.object,
}

export default TapCard;
