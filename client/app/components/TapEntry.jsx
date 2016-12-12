import React from 'react';
import {TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import link from '../libs/link';

const TapEntry = ({tap}) => (
  <TableRow>
    <TableRowColumn>{tap.name}</TableRowColumn>
    <TableRowColumn><IconButton href={ link('tapEdit', {id: tap.id})}><ModeEdit /></IconButton></TableRowColumn>
  </TableRow>
);

TapEntry.propTypes = {
  tap: React.PropTypes.object.isRequired,
}

export default TapEntry;
