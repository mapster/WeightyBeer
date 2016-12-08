import React, {PropTypes} from 'react';
import {GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import link from '../libs/link';

const BrewEntry = ({id, brewNo, name, style}) => (
  <GridTile
    title={'#' + brewNo + ' ' + name}
    subtitle={style}
    actionIcon={<IconButton href={ link('brewEdit', {id}) }><ModeEdit color='white' /></IconButton>}
  />
);

BrewEntry.propTypes = {
  id: PropTypes.string.isRequired,
  brewNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
}

export default BrewEntry;
