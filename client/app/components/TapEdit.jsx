import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import FavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Favorite from 'material-ui/svg-icons/action/favorite';
import {updater, selectUpdater, toggle} from '../libs/formHelpers';


const indent = {
  marginLeft: 20,
};
const buttonStyle = {
  ...indent,
  marginTop: 20,
  marginBottom: 20,
}

const TapEdit = ({tap = {}, onEdit, doSave, doCancel, brews, weights}) => (
  <Paper zDepth={1} style={{width: '80%', margin: '0 auto'}}>
    <IconButton onClick={toggle(tap, 'isActive', onEdit)}>{
      (tap.isActive && <Favorite />) || <FavoriteBorder />
    }</IconButton><br />
    <TextField onChange={updater(tap, 'name', onEdit)} style={indent} floatingLabelText='Name' name='name' defaultValue={tap.name || ''} /><br />
    <SelectField onChange={selectUpdater(tap, 'brew', onEdit)} floatingLabelText='Brew on tap' style={indent} value={tap.brew} autoWidth={true}>
      <MenuItem value={null} primaryText='' />
      {brews.sort((a,b) => a.brewNo - b.brewNo).map(brew =>
        <MenuItem key={brew.id} value={brew.id} primaryText={'#' + brew.brewNo + ' ' + brew.name} />
      )}
    </SelectField><br />
    <SelectField onChange={selectUpdater(tap, 'weight', onEdit)} floatingLabelText='Keg weight' style={indent} value={tap.weight} autoWidth={true}>
      <MenuItem value={null} primaryText='' />
      {weights.map(weight =>
        <MenuItem key={weight.id} value={weight.id} primaryText={weight.id} />
      )}
    </SelectField><br />
    <TextField onChange={updater(tap, 'volume', onEdit)} type='number' style={indent} floatingLabelText='Volume (L)' defaultValue={tap.volume || 1} /><br />
    <TextField onChange={updater(tap, 'order', onEdit)} style={indent} floatingLabelText='Order' name='order' type='number' defaultValue={tap.order || ''} /><br />
    <RaisedButton onClick={() => doSave(tap)} style={buttonStyle} primary={true} label='Save' />
    <RaisedButton onClick={doCancel} style={buttonStyle} secondary={true} label='Cancel' />
  </Paper>
);

TapEdit.propTypes = {
  tap: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
  doCancel: PropTypes.func.isRequired,
  brews: PropTypes.array.isRequired,
  weights: PropTypes.array.isRequired,
};

export default TapEdit;
