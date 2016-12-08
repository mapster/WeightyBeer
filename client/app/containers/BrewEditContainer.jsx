import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import BrewEdit from '../components/BrewEdit';
import NotFound from '../components/NotFound';
import {editBrew, saveBrew} from '../actions/brews';

class BrewEditContainer extends React.Component {
  render() {
    const {edit, brews, id, editBrew, doSave} = this.props;
    const brew = edit[id] || brews[id];
    if (!brew) {
      return <NotFound />;
    }

    return <BrewEdit brew={brew} onEdit={editBrew} doSave={doSave} />;
  }
}

BrewEditContainer.propTypes = {
  brews: PropTypes.array.isRequired,
  edit: PropTypes.object.isRequired,
  editBrew: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default compose(
  connect(state => ({
    edit: state.brews.edit,
    brews: state.brews.data,
    id: state.navigation.location.options.id,
  }), {
    editBrew,
    doSave: saveBrew,
  })
)(BrewEditContainer);
