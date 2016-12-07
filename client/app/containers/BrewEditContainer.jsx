import React, {PropTypes} from 'react';
import BrewEdit from '../components/BrewEdit';

const BrewEditContainer = () => (
  <BrewEdit />
);

BrewEditContainer.propTypes = {
  brews: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
};

export default BrewEditContainer;
