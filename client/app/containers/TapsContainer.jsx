import React, {PropTypes} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TapsList from '../components/TapsList';
import link from '../libs/link';

class TapsContainer extends React.Component {
  render() {
    const {taps} = this.props;
    return (
      <div>
        <h1>Taps</h1>
        <FloatingActionButton href={ link('tapEdit', {id: 'new'}) }><ContentAdd /></FloatingActionButton>
        <TapsList taps={Object.entries(taps).map(e => e[1])} />
      </div>
    );
  }
}

TapsContainer.propTypes = {
  taps: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({
    taps: state.taps.data,
  }), {
  })
)(TapsContainer);
