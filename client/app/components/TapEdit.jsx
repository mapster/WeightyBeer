import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const indent = {
  marginLeft: 20,
};
const buttonStyle = {
  ...indent,
  marginTop: 20,
  marginBottom: 20,
}

function updater(tap, prop, onEdit) {
  return e => onEdit({...tap, [prop]: e.target.value });
}

function selectUpdater(tap, prop, onEdit) {
  return (e, k, brew) => onEdit({...tap, [prop]: brew});
}

const TapEdit = ({tap = {}, onEdit, doSave, brews, weights}) => (
  <Paper zDepth={1} style={{width: '80%', margin: '0 auto'}}>
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
    <RaisedButton onClick={() => doSave(tap)} style={buttonStyle} backgroundColor='green' label='Save' labelColor='white' />
  </Paper>
);

TapEdit.propTypes = {
  tap: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
  brews: PropTypes.array.isRequired,
  weights: PropTypes.array.isRequired,
};

export default TapEdit;
