import React, {PropTypes} from 'react';
import TapEntry from './TapEntry';
import {Table, TableHeader,  TableHeaderColumn, TableBody, TableRow } from 'material-ui/Table';

const TapsList = ({taps, brews}) => (
  <Table>
    <TableHeader displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Brew on tap</TableHeaderColumn>
        <TableHeaderColumn>Keg weight</TableHeaderColumn>
        <TableHeaderColumn />
      </TableRow>
    </TableHeader>
    <TableBody>{taps.map(tap =>
        <TapEntry key={tap.id} tap={tap} brew={brews[tap.brew]} />
    )}</TableBody>
  </Table>
);

TapsList.propTypes = {
  taps: PropTypes.array.isRequired,
  brews: PropTypes.object.isRequired,
};

export default TapsList;
