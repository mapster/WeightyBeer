import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import BrewEdit from '../components/BrewEdit';

class BrewEditContainer extends React.Component {
  render() {
    const {brews, id} = this.props;
    const brew = brews.find((b) => b.id == id);
    return <BrewEdit {...brew} />;
  }
}

BrewEditContainer.propTypes = {
  brews: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
};

export default compose(
  connect(state => ({
    brews: state.brews.data,
    id: state.navigation.location.options.id,
  }), {
  })
)(BrewEditContainer);
