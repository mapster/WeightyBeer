import React from 'react';
import BrewEntry from './BrewEntry';

const BrewsList = ({brews}) => (
  <table>
    <thead>
      <tr>
        <th>Brew #</th>
        <th>Name</th>
        <th>Style</th>
      </tr>
    </thead>
    <tbody>{brews.map((b) =>
        <BrewEntry key={b.brew} brew={b.brew} name={b.name} style={b.style} />
    )}</tbody>
  </table>
);

BrewsList.propTypes = {
  brews: React.PropTypes.array.isRequired,
};

export default BrewsList;
