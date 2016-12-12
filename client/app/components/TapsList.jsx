import React, {PropTypes} from 'react';
import TapEntry from './TapEntry';
import {Table, TableHeader,  TableHeaderColumn, TableBody, TableRow } from 'material-ui/Table';

const TapsList = ({taps}) => (
  <Table>
    <TableHeader displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn />
      </TableRow>
    </TableHeader>
    <TableBody>{taps.map(tap =>
        <TapEntry key={tap.id} tap={tap} />
    )}</TableBody>
  </Table>
);

TapsList.propTypes = {
  taps: PropTypes.array.isRequired,
};

export default TapsList;
