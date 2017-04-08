import uniloc from 'uniloc';

export default uniloc({
  home: 'GET /',
  taps: 'GET /taps',
  tapEdit: 'GET /taps/:id/edit',
  brews: 'GET /brews',
  brewEdit: 'GET /brews/:id/edit',
  weighthub: 'GET /weights',
  image: 'GET /image',
});
