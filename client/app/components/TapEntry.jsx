import React from 'react';
import {TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import link from '../libs/link';

const brewName = (brew) =>  (brew && ('#' + brew.brewNo + ' ' + brew.name)) || '';

const TapEntry = ({tap, brew}) => (
  <TableRow>
    <TableRowColumn>{tap.name}</TableRowColumn>
    <TableRowColumn>{brewName(brew)}</TableRowColumn>
    <TableRowColumn>{tap.weight}</TableRowColumn>
    <TableRowColumn><IconButton href={ link('tapEdit', {id: tap.id})}><ModeEdit /></IconButton></TableRowColumn>
  </TableRow>
);

TapEntry.propTypes = {
  tap: React.PropTypes.object.isRequired,
  brew: React.PropTypes.object,
}

export default TapEntry;
