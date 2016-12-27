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

const BrewEdit = ({brew = {}, onEdit, doCancel, doSave, doDeleteImage, doUploadImage, images}) => (
  <Paper zDepth={1} style={paperStyle}>
    <div style={{float: 'left', width: '45%'}}>
      <TextField onChange={updater(brew, 'brewNo', onEdit)} type='number' floatingLabelText='Brew #' name='brewNo' defaultValue={brew.brewNo || ''} /><br />
      <TextField onChange={updater(brew, 'name', onEdit)} floatingLabelText='Name' name='name' defaultValue={brew.name || ''} /><br />
      <TextField onChange={updater(brew, 'style', onEdit)} floatingLabelText='Style' name='style' defaultValue={brew.style || ''} /><br />
      <TextField onChange={updater(brew, 'abv', onEdit)} floatingLabelText='ABV' name='abv' defaultValue={brew.abv || ''} /><br />
      <TextField onChange={updater(brew, 'ibu', onEdit)} floatingLabelText='IBU' name='ibu' defaultValue={brew.ibu || ''} /><br />
    </div>
    <div >
      <ImageChooser
        doSelectImage={(id) => onEdit({...brew, image: id})}
        doDeleteImage={doDeleteImage}
        doUploadImage={doUploadImage}
        images={Object.entries(images).map(e => e[1])}
        selectedId={brew.image}
      />
    </div>
    <br style={{clear: 'both'}} />
    <RaisedButton onClick={() => doSave(brew)} style={buttonStyle} primary={true} label='Save'/>
    <RaisedButton onClick={doCancel} style={buttonStyle} secondary={true} label='Cancel'/>
  </Paper>
);

BrewEdit.propTypes = {
  brew: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  doCancel: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
  doDeleteImage: PropTypes.func.isRequired,
  doUploadImage: PropTypes.func.isRequired,
  images: PropTypes.object.isRequired,
};

export default BrewEdit;
