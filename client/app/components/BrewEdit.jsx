import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

const indent = {
  marginLeft: 20,
};

function updater(brew, prop, onEdit) {
  return e => {
    return onEdit(Object.assign({}, brew, {[prop]: e.target.value }));
  };
}

const BrewEdit = ({brew, onEdit}) => (
  <Paper zDepth={1} style={{width: '80%', margin: '0 auto'}}>
    <TextField style={indent} floatingLabelText='Brew #' name='brewNo' value={brew.brewNo || ''} /><br />
    <TextField onChange={updater(brew, 'name', onEdit)} style={indent} floatingLabelText='Name' name='name' defaultValue={brew.name || ''} /><br />
    <TextField style={indent} floatingLabelText='Style' name='style' value={brew.style || ''} /><br />
  </Paper>
);

BrewEdit.propTypes = {
  brew: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default BrewEdit;
