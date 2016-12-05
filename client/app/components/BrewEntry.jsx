import React from 'react';

export default class BrewEntry extends React.Component {
  render() {
    const {brew, style, name} = this.props.brew;
    return (
      <tr>
        <td>{brew}</td>
        <td>{name}</td>
        <td>{style}</td>
      </tr>
    );
  }
}

BrewEntry.propTypes = {
  brew: React.PropTypes.object.isRequired,
}
