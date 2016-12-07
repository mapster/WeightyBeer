import React, {PropTypes} from 'react';
import BrewsList from '../components/BrewsList';

export default class BrewsListContainer extends React.Component {
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
  brews: PropTypes.object.isRequired,
};
