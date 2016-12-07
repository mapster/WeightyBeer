import React, {PropTypes} from 'react';
import {GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import link from '../libs/link';

const BrewEntry = ({brew, name, style}) => (
  <GridTile
    title={'#' + brew + ' ' + name}
    subtitle={style}
    actionIcon={<IconButton href={link('brewEdit', {id: brew})}><ModeEdit color='white' /></IconButton>}
  />
);

BrewEntry.propTypes = {
  brew: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
}

export default BrewEntry;
