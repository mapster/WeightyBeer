import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import BrewsList from '../components/BrewsList';
import link from '../libs/link';
import {navigationStart} from '../actions/navigation';
import {deleteBrew} from '../actions/brews';

class BrewsListContainer extends React.Component {
  render() {
    const {brews, images, doNavigateTo, doDeleteBrew} = this.props;
    return (
      <div>
        <FloatingActionButton href={ link('brewEdit', {id: 'new'}) }><ContentAdd /></FloatingActionButton>
        <div className='brewsList'>
          <BrewsList doDeleteBrew={doDeleteBrew} toEditBrew={(id) => doNavigateTo('brewEdit', {id})} brews={Object.entries(brews).map(e => e[1])} images={images} />
        </div>
      </div>
    );
  }
}

BrewsListContainer.propTypes = {
  brews: PropTypes.object.isRequired,
  images: PropTypes.object.isRequired,
  doNavigateTo: PropTypes.func.isRequired,
  doDeleteBrew: PropTypes.func.isRequired,
};

export default compose(
  connect(state => ({
    brews: state.brews.data,
    images: state.images.data,
  }), {
    doDeleteBrew: deleteBrew,
    doNavigateTo: navigationStart,
  })
)(BrewsListContainer);
