import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TapsList from '../components/TapsList';
import link from '../libs/link';
import {quickSaveTap} from '../actions/taps';

class TapsContainer extends React.Component {
  render() {
    const {taps, brews, doQuickSave} = this.props;
    return (
      <div>
        <h1>Taps</h1>
        <FloatingActionButton href={ link('tapEdit', {id: 'new'}) }><ContentAdd /></FloatingActionButton>
        <TapsList taps={Object.entries(taps).map(e => e[1])} brews={brews} doQuickSave={doQuickSave} />
      </div>
    );
  }
}

TapsContainer.propTypes = {
  taps: PropTypes.object.isRequired,
  brews: PropTypes.object.isRequired,
  doQuickSave: PropTypes.func.isRequired,
};

export default compose(
  connect(state => ({
    taps: state.taps.data,
    brews: state.brews.data,
  }), {
    doQuickSave: quickSaveTap,
  })
)(TapsContainer);
