import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {updater} from '../libs/formHelpers';
import ImageChooser from './ImageChooser';

const buttonStyle = {
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 20,
}
const paperStyle = {
  width: '80%',
  margin: '0 auto',
  paddingLeft: 20,
  backgroundColor: '#424242',
}
// style={{marginTop: '20px', width: '45%', marginRight: 20, float: 'right'}}
const BrewEdit = ({brew = {}, onEdit, doSave, doUploadImage, images}) => (
  <Paper zDepth={1} style={paperStyle}>
    <div style={{float: 'left', width: '45%'}}>
      <TextField onChange={updater(brew, 'brewNo', onEdit)} type='number' floatingLabelText='Brew #' name='brewNo' defaultValue={brew.brewNo || ''} /><br />
      <TextField onChange={updater(brew, 'name', onEdit)} floatingLabelText='Name' name='name' defaultValue={brew.name || ''} /><br />
      <TextField onChange={updater(brew, 'style', onEdit)} floatingLabelText='Style' name='style' defaultValue={brew.style || ''} /><br />
    </div>
    <div >
      <ImageChooser
        doSelectImage={(id) => onEdit({...brew, image: id})}
        doUploadImage={doUploadImage}
        images={Object.entries(images).map(e => e[1])}
        selectedId={brew.image}
      />
    </div>
    <br style={{clear: 'both'}} />
    <RaisedButton onClick={() => doSave(brew)} style={buttonStyle} primary={true} label='Save'/>
    <RaisedButton style={buttonStyle} secondary={true} label='Cancel'/>
  </Paper>
);

BrewEdit.propTypes = {
  brew: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
  doUploadImage: PropTypes.func.isRequired,
  images: PropTypes.object.isRequired,
};

export default BrewEdit;
