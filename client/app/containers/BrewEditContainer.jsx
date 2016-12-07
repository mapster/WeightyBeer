import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import BrewEdit from '../components/BrewEdit';
import {editBrew} from '../actions/brews';

class BrewEditContainer extends React.Component {
  render() {
    const {edit, brews, id, editBrew} = this.props;
    const brew = edit[id] || brews.find((b) => b.id == id);
    return <BrewEdit brew={brew} onEdit={editBrew} />;
  }
}

BrewEditContainer.propTypes = {
  brews: PropTypes.array.isRequired,
  edit: PropTypes.object.isRequired,
  editBrew: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default compose(
  connect(state => ({
    edit: state.brews.edit,
    brews: state.brews.data,
    id: state.navigation.location.options.id,
  }), {
    editBrew,
  })
)(BrewEditContainer);
