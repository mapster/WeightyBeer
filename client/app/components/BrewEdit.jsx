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

function updater(brew, prop, onEdit, doSave) {
  return e => {
    return onEdit(Object.assign({}, brew, {[prop]: e.target.value }));
  };
}

const BrewEdit = ({brew = {}, onEdit, doSave}) => (
  <Paper zDepth={1} style={{width: '80%', margin: '0 auto'}}>
    <TextField style={indent} floatingLabelText='Brew #' name='brewNo' defaultValue={brew.brewNo || ''} /><br />
    <TextField onChange={updater(brew, 'name', onEdit)} style={indent} floatingLabelText='Name' name='name' defaultValue={brew.name || ''} /><br />
    <TextField style={indent} floatingLabelText='Style' name='style' defaultValue={brew.style || ''} /><br />
    <RaisedButton onClick={() => doSave(brew)} style={buttonStyle} backgroundColor='green' label='Save' labelColor='white' />
    <RaisedButton style={buttonStyle} backgroundColor='red' label='Cancel' labelColor='white' />
  </Paper>
);

BrewEdit.propTypes = {
  brew: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
};

export default BrewEdit;
