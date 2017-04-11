import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {updater} from '../libs/formHelpers';
import ImageChooser from './ImageChooser';
import ImageEditor from './ImageEditor';

const openImage = (doEdit, brew, e) => {
  let file = e.target.files[0];

  if (file) {
    const img = new Image();

    let reader = new FileReader();
    reader.addEventListener('load', () => {
      img.src = reader.result;
      doEdit({...brew, newImage: img});
    }, false);

    reader.readAsDataURL(file);
    doEdit({...brew, newImage: {complete: false}});
  }
}

const BrewEdit = ({brew = {}, onEdit, doCancel, doSave, doDeleteImage, doUploadImage, images}) => {
  if (!brew.newImage) {
    return (
      <Paper zDepth={1} className='editPaper'>
        <div className='leftColumn'>
          <TextField onChange={updater(brew, 'brewNo', onEdit)} type='number' floatingLabelText='Brew #' name='brewNo' defaultValue={brew.brewNo || ''} /><br />
          <TextField onChange={updater(brew, 'name', onEdit)} floatingLabelText='Name' name='name' defaultValue={brew.name || ''} /><br />
          <TextField onChange={updater(brew, 'style', onEdit)} floatingLabelText='Style' name='style' defaultValue={brew.style || ''} /><br />
          <TextField onChange={updater(brew, 'abv', onEdit)} type='number' floatingLabelText='ABV' name='abv' defaultValue={brew.abv || ''} /><br />
          <TextField onChange={updater(brew, 'ibu', onEdit)} type='number' floatingLabelText='IBU' name='ibu' defaultValue={brew.ibu || ''} /><br />
        </div>
        <div>
          <ImageChooser
            doSelectImage={(id) => onEdit({...brew, image: id})}
            doDeleteImage={doDeleteImage}
            doUploadImage={doUploadImage}
            images={Object.entries(images).map(e => e[1])}
            selectedId={brew.image}
            />
          <RaisedButton containerElement='label' label='Upload image' labelPosition='before'>
            <input type='file' className='hiddenFileInput' onChange={e => openImage(onEdit, brew, e)} />
          </RaisedButton>
        </div>
        <br className='buttonSeparator'/>
        <RaisedButton onClick={() => doSave(brew)} primary={true} label='Save' className='formButton'/>
        <RaisedButton onClick={doCancel} secondary={true} label='Cancel' className='formButton'/>
      </Paper>
    );
  } else {
    return <ImageEditor targetWidth={332} targetHeight={230} imgSrc={brew.newImage} saveImage={doUploadImage} doCancel={() => onEdit({...brew, newImage: false})} />;
  }
};

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
