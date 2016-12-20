import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import BrewEdit from '../components/BrewEdit';
import NotFound from '../components/NotFound';
import {editBrew, saveBrew} from '../actions/brews';
import {uploadImage} from '../actions/images';

class BrewEditContainer extends React.Component {
  render() {
    const {edit, brews, id, editBrew, doSave, doUploadImage, images} = this.props;

    let brew = edit[id];
    if (!brew) {
      brew = id == 'new' ? {id: 'new'} : brews[id];
    }
    if (!brew) {
      return <NotFound />;
    }

    return <BrewEdit
      brew={brew}
      onEdit={editBrew}
      doSave={doSave}
      doUploadImage={doUploadImage}
      images={images}
      />;
  }
}

BrewEditContainer.propTypes = {
  brews: PropTypes.object.isRequired,
  edit: PropTypes.object.isRequired,
  editBrew: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired,
  doUploadImage: PropTypes.func.isRequired,
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
    editBrew,
    doSave: saveBrew,
    doUploadImage: uploadImage,
  })
)(BrewEditContainer);
