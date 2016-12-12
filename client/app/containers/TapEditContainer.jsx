import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import TapEdit from '../components/TapEdit';
import NotFound from '../components/NotFound';
import {editTap, saveTap} from '../actions/taps';

const toArray = (obj) => Object.entries(obj).map(e => e[1]);

class TapsEditContainer extends React.Component {
  render() {
    const {edit, taps, id, onEdit, doSave, brews, weights} = this.props;

    let tap = edit[id];
    if (!tap) {
      tap = (id == 'new' ? {id: 'new'} : taps[id]);
    }
    if (!tap) {
      return <NotFound />;
    }

    return <TapEdit tap={tap} onEdit={onEdit} doSave={doSave} brews={toArray(brews)} weights={toArray(weights)}/>;
  }
}

TapsEditContainer.propTypes = {
  edit: PropTypes.object.isRequired,
  taps: PropTypes.object.isRequired,
  brews: PropTypes.object.isRequired,
  weights: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
};

export default compose(
  connect(state => ({
    edit: state.taps.edit,
    taps: state.taps.data,
    brews: state.brews.data,
    weights: state.weights.data,
    id: state.navigation.location.options.id,
  }), {
    onEdit: editTap,
    doSave: saveTap,
  })
)(TapsEditContainer);
