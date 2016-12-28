import React, {PropTypes} from 'react';
import TapEntry from './TapEntry';
import {Table, TableHeader,  TableHeaderColumn, TableBody, TableRow } from 'material-ui/Table';

const TapsList = ({taps, brews, doQuickSave}) => (
  <Table>
    <TableHeader displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Brew on tap</TableHeaderColumn>
        <TableHeaderColumn>Keg weight</TableHeaderColumn>
        <TableHeaderColumn>Favorite</TableHeaderColumn>
        <TableHeaderColumn />
      </TableRow>
    </TableHeader>
    <TableBody>{taps.sort((a, b) => a.order - b.order).map(tap =>
        <TapEntry key={tap.id} tap={tap} brew={brews[tap.brew]} doQuickSave={doQuickSave} />
    )}</TableBody>
  </Table>
);

TapsList.propTypes = {
  taps: PropTypes.array.isRequired,
  brews: PropTypes.object.isRequired,
  doQuickSave: PropTypes.func.isRequired,
};

export default TapsList;
