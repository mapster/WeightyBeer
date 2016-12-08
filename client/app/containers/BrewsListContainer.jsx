import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import BrewsList from '../components/BrewsList';

class BrewsListContainer extends React.Component {
  render() {
    const {brews} = this.props;
    return (
      <div>
        <h1>Brews</h1>
        <BrewsList brews={Object.entries(brews).map(e => e[1])} />
      </div>
    );
  }
}

BrewsListContainer.propTypes = {
  brews: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({
    brews: state.brews.data,
  }), {
  })
)(BrewsListContainer);
