import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
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

const TapEdit = ({tap = {}, onEdit, doSave}) => (
  <Paper zDepth={1} style={{width: '80%', margin: '0 auto'}}>
    <TextField onChange={updater(tap, 'name', onEdit)} style={indent} floatingLabelText='Name' name='name' defaultValue={tap.name || ''} /><br />
    <RaisedButton onClick={() => doSave(tap)} style={buttonStyle} backgroundColor='green' label='Save' labelColor='white' />
  </Paper>
);

TapEdit.propTypes = {
  tap: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
};

export default TapEdit;
