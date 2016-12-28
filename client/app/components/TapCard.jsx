import React, {PropTypes} from 'react';
import {Card, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

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
const brewDetails = (brew) => {
  if (brew.ibu || brew.abv) {
    const ibu = brew.ibu ? ('IBU: ' + brew.ibu) : '';
    const abv = brew.abv ? ('ABV: ' + brew.abv + '%') : '';
    return <CardTitle subtitle={ibu + (brew.ibu && brew.abv ? ' - ' : '') + abv} />;
  }
  return null;
}

const brewImage = (images, brew) => {
  const img = images[brew.image] || {};
  return img.url;
}

const TapCard = ({tap, brew, images, weight}) => (
  <div className='tapCard'>
    <Card style={cardStyle} className='favorite-tap'>
      <CardHeader title={tap.name}/>
      <CardMedia overlay={brewDetails(brew)}>
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
