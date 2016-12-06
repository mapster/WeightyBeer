import React from 'react';
import BrewEntry from './BrewEntry';

export default class BrewsList extends React.Component {
  render() {
    const {brews} = this.props;
    return (
      <table>
        <thead>
          <tr>
            <th>Brew #</th>
            <th>Name</th>
            <th>Style</th>
          </tr>
        </thead>
        <tbody>{brews.map((brew) =>
            <BrewEntry key={brew.brew} brew={brew} />
        )}</tbody>
      </table>
    );
  }
}

BrewsList.propTypes = {
  brews: React.PropTypes.array.isRequired,
};
