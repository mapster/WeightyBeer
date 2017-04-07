import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import ROUTES from '../routes';


const muiTheme = getMuiTheme({
  ...darkBaseTheme,
});

const pages = [
  {name: 'home', text: 'Home'},
  {name: 'taps', text: 'Taps'},
  {name: 'brews', text: 'Brews'},
  {name: 'weighthub', text: 'Weight Hub'},
]

export default class ApplicationLayout extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='container'>
          <Toolbar className='appbar'>
            <ToolbarGroup firstChild={true}>{pages.map(p =>
                <FlatButton key={p.name} label={p.text} href={'#'+ROUTES.generate(p.name)} />
            )}</ToolbarGroup>
          </Toolbar>
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
