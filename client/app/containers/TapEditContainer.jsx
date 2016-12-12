import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import TapEdit from '../components/TapEdit';
import NotFound from '../components/NotFound';
import {editTap, saveTap} from '../actions/taps';

class TapsEditContainer extends React.Component {
  render() {
    const {edit, taps, id, onEdit, doSave} = this.props;

    let tap = edit[id];
    if (!tap) {
      tap = (id == 'new' ? {id: 'new'} : taps[id]);
    }
    if (!tap) {
      return <NotFound />;
    }

    return <TapEdit tap={tap} onEdit={onEdit} doSave={doSave} />;
  }
}

TapsEditContainer.propTypes = {
  edit: PropTypes.object.isRequired,
  taps: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
};

export default compose(
  connect(state => ({
    edit: state.taps.edit,
    taps: state.taps.data,
    id: state.navigation.location.options.id,
  }), {
    onEdit: editTap,
    doSave: saveTap,
  })
)(TapsEditContainer);
