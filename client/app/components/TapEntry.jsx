import React, {PropTypes} from 'react';
import {TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import FavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Favorite from 'material-ui/svg-icons/action/favorite';
import {toggle} from '../libs/formHelpers';
import link from '../libs/link';

const brewName = (brew) =>  (brew && ('#' + brew.brewNo + ' ' + brew.name)) || '';

const TapEntry = ({tap, brew, doQuickSave}) => (
  <TableRow>
    <TableRowColumn className='centerText'>{tap.name}</TableRowColumn>
    <TableRowColumn className='centerText'>{brewName(brew)}</TableRowColumn>
    <TableRowColumn className='centerText'>{tap.weight}</TableRowColumn>
    <TableRowColumn className='centerText'>
      <IconButton onClick={toggle(tap, 'isActive', doQuickSave)}>{
        (tap.isActive && <Favorite />) || <FavoriteBorder />
      }</IconButton><br />
    </TableRowColumn>
    <TableRowColumn className='centerText'><IconButton href={ link('tapEdit', {id: tap.id})}><ModeEdit /></IconButton></TableRowColumn>
  </TableRow>
);

TapEntry.propTypes = {
  tap: PropTypes.object.isRequired,
  brew: PropTypes.object,
  doQuickSave: PropTypes.func.isRequired,
}

export default TapEntry;
