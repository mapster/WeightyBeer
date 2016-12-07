import uniloc from 'uniloc';

export default uniloc({
  home: 'GET /',
  taps: 'GET /taps',
  brews: 'GET /brews',
  brewEdit: 'GET /brews/:id/edit',
  weights: 'GET /weights',
});
