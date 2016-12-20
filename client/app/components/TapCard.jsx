import React, {PropTypes} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {storage} from '../libs/FirebaseApp';
// import link from '../libs/link';

const imagesRef = storage.ref('app/images');

const cardStyle = {
  backgroundColor: '#424242'
};

const brewName = (brew) =>  (brew && ('#' + brew.brewNo + ' ' + brew.name)) || '';
const volumeText = (tap, weight) => {
  if(!tap.volume || !weight.percent) {
    return '';
  }
  return '(' + (tap.volume * weight.percent / 100.0).toFixed(2) + '/' + tap.volume + ' L)';
}

const TapCard = ({tap, brew, weight}) => (
  <Card style={cardStyle} className='favorite-tap'>
    <CardHeader title={tap.name}/>
    <CardMedia>
      <img src='https://firebasestorage.googleapis.com/v0/b/weightybeer.appspot.com/o/app%2Fimages%2Fbeer.jpg?alt=media&token=17ac5ff7-3f8e-46d9-ad5d-b507445c2ec1' />
    </CardMedia>
    <CardTitle title={brewName(brew)} subtitle={brew.style}>
      <Divider style={{marginTop: '5px', marginBottom: '5px'}} />
      <div>Remaining: {weight.percent}% {volumeText(tap, weight)}</div>
    </CardTitle>
  </Card>
);

TapCard.propTypes = {
  tap: PropTypes.object.isRequired,
  brew: PropTypes.object,
  weight: PropTypes.object,
}

export default TapCard;
