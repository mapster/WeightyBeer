import React, {PropTypes} from 'react';
import WeightEntry from './WeightEntry';
import {Table, TableHeader,  TableHeaderColumn, TableBody, TableRow } from 'material-ui/Table';

const WeightsList = ({weights, doCalibrate}) => (
  <Table>
    <TableHeader displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Current</TableHeaderColumn>
        <TableHeaderColumn>Nothing</TableHeaderColumn>
        <TableHeaderColumn>Empty Keg</TableHeaderColumn>
        <TableHeaderColumn>Full Keg</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>{weights.map(w =>
        <WeightEntry key={w.id} weight={w} doCalibrate={(target) => doCalibrate(w.id, target)} />
    )}</TableBody>
  </Table>
);

WeightsList.propTypes = {
  weights: PropTypes.array.isRequired,
  doCalibrate: PropTypes.func.isRequired,
};

export default WeightsList;
