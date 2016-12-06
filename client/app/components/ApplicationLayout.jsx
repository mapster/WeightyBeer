import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import ROUTES from '../routes';


const muiTheme = getMuiTheme();
const pages = [
  {name: 'home', text: 'Home'},
  {name: 'taps', text: 'Taps'},
  {name: 'brews', text: 'Brews'},
  {name: 'weights', text: 'Weights'},
]

export default class ApplicationLayout extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <nav className='navbar'>{pages.map(p =>
            <FlatButton key={p.name} label={p.name} href={'#'+ROUTES.generate(p.name)} />
          )}</nav>
          <main className='content'>
            {this.props.children}
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

ApplicationLayout.propTypes = {
  children: React.PropTypes.node.isRequired,
  locationName: React.PropTypes.string,
};
