import React from 'react';
import ROUTES from '../routes';

const Link = ({name, options, children, ...props}) =>
  <a {...props} href={'#'+ROUTES.generate(name, options)}>{children}</a>;

Link.propTypes = {
  name: React.PropTypes.string.isRequired,
  options: React.PropTypes.object,
  children: React.PropTypes.node.isRequired,
};

export default Link;
