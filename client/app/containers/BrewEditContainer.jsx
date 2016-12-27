import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import BrewEdit from '../components/BrewEdit';
import NotFound from '../components/NotFound';
import {clearChanges, editBrew, saveBrew} from '../actions/brews';
import {uploadImage, deleteImage} from '../actions/images';
import {navigationStart} from '../actions/navigation';

class BrewEditContainer extends React.Component {
  render() {
    const {edit, brews, id, editBrew, doClearChanges, doSave, doDeleteImage, doUploadImage, doNavigateTo, images} = this.props;

    let brew = edit[id];
    if (!brew) {
      brew = id == 'new' ? {id: 'new'} : brews[id];
    }
    if (!brew) {
      return <NotFound />;
    }

    const doCancel = () => {
      doClearChanges(brew.id);
      doNavigateTo('brews');
    };

    return <BrewEdit
      brew={brew}
      onEdit={editBrew}
      doCancel={doCancel}
      doSave={doSave}
      doDeleteImage={doDeleteImage}
      doUploadImage={doUploadImage}
      images={images}
    />;
  }
}

BrewEditContainer.propTypes = {
  brews: PropTypes.object.isRequired,
  edit: PropTypes.object.isRequired,
  editBrew: PropTypes.func.isRequired,
  doClearChanges: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
  doDeleteImage: PropTypes.func.isRequired,
  doUploadImage: PropTypes.func.isRequired,
  doNavigateTo: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  images: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({
    edit: state.brews.edit,
    brews: state.brews.data,
    id: state.navigation.location.options.id,
    images: state.images.data,
  }), {
    doClearChanges: clearChanges,
    editBrew,
    doSave: saveBrew,
    doDeleteImage: deleteImage,
    doUploadImage: uploadImage,
    doNavigateTo: navigationStart,
  })
)(BrewEditContainer);
