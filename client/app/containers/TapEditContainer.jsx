import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import TapEdit from '../components/TapEdit';
import NotFound from '../components/NotFound';
import {editTap, saveTap, clearChanges} from '../actions/taps';
import {navigationStart} from '../actions/navigation';

class TapsEditContainer extends React.Component {
  render() {
    const {edit, taps, id, onEdit, doSave, doClearChanges, doNavigateTo, brews, weights, images} = this.props;

    let tap = edit[id];
    if (!tap) {
      tap = (id == 'new' ? {id: 'new'} : taps[id]);
    }
    if (!tap) {
      return <NotFound />;
    }

    const doCancel = () => {
      doClearChanges(tap.id);
      doNavigateTo('taps');
    };

    return <TapEdit tap={tap} onEdit={onEdit} doSave={doSave} doCancel={doCancel} brews={brews} weights={weights} images={images}/>;
  }
}

TapsEditContainer.propTypes = {
  edit: PropTypes.object.isRequired,
  taps: PropTypes.object.isRequired,
  brews: PropTypes.object.isRequired,
  weights: PropTypes.object.isRequired,
  images: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
  doClearChanges: PropTypes.func.isRequired,
  doNavigateTo: PropTypes.func.isRequired,
};

export default compose(
  connect(state => ({
    edit: state.taps.edit,
    taps: state.taps.data,
    brews: state.brews.data,
    weights: state.weights.data,
    images: state.images.data,
    id: state.navigation.location.options.id,
  }), {
    onEdit: editTap,
    doSave: saveTap,
    doClearChanges: clearChanges,
    doNavigateTo: navigationStart,
  })
)(TapsEditContainer);
