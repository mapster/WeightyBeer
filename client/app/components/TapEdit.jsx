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
import TapCard from './TapCard';

const toArray = (obj) => Object.entries(obj).map(e => e[1]);

const TapEdit = ({tap = {}, onEdit, doSave, doCancel, brews, weights, images}) => (
  <Paper zDepth={1} className='editPaper tapEdit'>
    <div className='leftColumn'>
      <IconButton onClick={toggle(tap, 'isActive', onEdit)}>{
        (tap.isActive && <Favorite />) || <FavoriteBorder />
      }</IconButton><br />
      <TextField onChange={updater(tap, 'name', onEdit)} floatingLabelText='Name' name='name' defaultValue={tap.name || ''} /><br />
      <SelectField onChange={selectUpdater(tap, 'brew', onEdit)} floatingLabelText='Brew on tap' value={tap.brew} autoWidth={true}>
        <MenuItem value={null} primaryText='' />
        {toArray(brews).sort((a,b) => a.brewNo - b.brewNo).map(brew =>
          <MenuItem key={brew.id} value={brew.id} primaryText={'#' + brew.brewNo + ' ' + brew.name} />
        )}
      </SelectField><br />
    <SelectField onChange={selectUpdater(tap, 'weight', onEdit)} floatingLabelText='Keg weight' value={tap.weight} autoWidth={true}>
        <MenuItem value={null} primaryText='' />
        {toArray(weights).map(weight =>
          <MenuItem key={weight.id} value={weight.id} primaryText={weight.id} />
        )}
      </SelectField><br />
      <TextField onChange={updater(tap, 'volume', onEdit)} type='number' floatingLabelText='Volume (L)' defaultValue={tap.volume || 1} /><br />
      <TextField onChange={updater(tap, 'order', onEdit)} floatingLabelText='Order' name='order' type='number' defaultValue={tap.order || ''} /><br />
    </div>
    <div className='rightColumn'>
      <TapCard tap={tap} brew={brews[tap.brew]} weight={weights[tap.weight]} images={images} />
    </div>
    <br className='buttonSeparator'/>
    <RaisedButton onClick={() => doSave(tap)} primary={true} label='Save' className='formButton' />
    <RaisedButton onClick={doCancel} secondary={true} label='Cancel' className='formButton'/>
  </Paper>
);

TapEdit.propTypes = {
  tap: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
  doCancel: PropTypes.func.isRequired,
  brews: PropTypes.object.isRequired,
  weights: PropTypes.object.isRequired,
  images: PropTypes.object.isRequired,
};

export default TapEdit;
