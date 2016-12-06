import React, {PropTypes} from 'react';

const BrewEntry = ({brew, name, style}) => (
  <tr>
    <td>{brew}</td>
    <td>{name}</td>
    <td>{style}</td>
  </tr>
);

BrewEntry.propTypes = {
  brew: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
}

export default BrewEntry;
