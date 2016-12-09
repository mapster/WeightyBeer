import React from 'react';
import {TableRow, TableRowColumn} from 'material-ui/Table';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import IconButton from 'material-ui/IconButton';

const WeightEntry = ({weight, doCalibrate}) => (
  <TableRow>
    <TableRowColumn>{weight.id}</TableRowColumn>
    <TableRowColumn>{weight.percent}% ({weight.current})</TableRowColumn>
    <TableRowColumn>{weight.zero} <IconButton onClick={() => doCalibrate('zero')}><Refresh color='red' /></IconButton></TableRowColumn>
    <TableRowColumn>{weight.empty} <IconButton onClick={() => doCalibrate('empty')}><Refresh color='red' /></IconButton></TableRowColumn>
    <TableRowColumn>{weight.full} <IconButton onClick={() => doCalibrate('full')}><Refresh color='red' /></IconButton></TableRowColumn>
  </TableRow>
);

WeightEntry.propTypes = {
  weight: React.PropTypes.object.isRequired,
  doCalibrate: React.PropTypes.func.isRequired,
}

export default WeightEntry;
