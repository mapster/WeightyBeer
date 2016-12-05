import React from 'react';

export default class Taps extends React.Component {
  render() {
    const {taps} = this.props;

    return(
      <div className="taps">{taps.map(tap =>
          <div key={tap.name}>{tap.name}</div>
      )}</div>
    );
  }
}

Taps.propTypes = {
  taps: React.PropTypes.array
}
