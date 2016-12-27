import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import BrewsList from '../components/BrewsList';
import link from '../libs/link';

class BrewsListContainer extends React.Component {
  render() {
    const {brews, images} = this.props;
    return (
      <div>
        <h1>Brews</h1>
        <FloatingActionButton href={ link('brewEdit', {id: 'new'}) }><ContentAdd /></FloatingActionButton>
        <div className='brewsList'>
          <BrewsList brews={Object.entries(brews).map(e => e[1])} images={images} />
        </div>
      </div>
    );
  }
}

BrewsListContainer.propTypes = {
  brews: PropTypes.object.isRequired,
  images: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({
    brews: state.brews.data,
    images: state.images.data,
  }), {
  })
)(BrewsListContainer);
