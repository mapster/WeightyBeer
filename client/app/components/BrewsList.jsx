import React from 'react';
import BrewEntry from './BrewEntry';

export default class BrewsList extends React.Component {
  render() {
    const {brews} = this.props;
    return (
      <table>{brews.map((brew) =>
        <BrewEntry key={brew.brew} brew={brew} />
      )}</table>
    );
  }
}

BrewsList.propTypes = {
  brews: React.PropTypes.array.isRequired,
};
