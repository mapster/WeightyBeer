import React from 'react';
import Link from './Link';

export default class ApplicationLayout extends React.Component {
  render() {
    return (
      <div>
        <nav className='navbar'>
          <Link name='home'>Root</Link>
          <Link name='taps'>Taps</Link>
          <Link name='brews'>Brews</Link>
          <Link name='weights'>Weights</Link>
        </nav>
        <main className='content'>
          {this.props.children}
        </main>
      </div>
    );
  }
}

ApplicationLayout.propTypes = {
  children: React.PropTypes.node.isRequired,
  locationName: React.PropTypes.string,
};
