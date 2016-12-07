import ROUTES from '../routes';

export default (name, options) => '#' + ROUTES.generate(name, options);
