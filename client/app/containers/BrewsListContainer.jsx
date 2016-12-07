import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import BrewsList from '../components/BrewsList';

class BrewsListContainer extends React.Component {
  render() {
    const {data} = this.props.brews;
    return (
      <div>
        <h1>Brews</h1>
        <BrewsList brews={data} />
      </div>
    );
  }
}

BrewsListContainer.propTypes = {
  brews: PropTypes.array.isRequired,
};

export default compose(
  connect(state => ({
    brews: state.brews,
  }), {
  })
)(BrewsListContainer);
