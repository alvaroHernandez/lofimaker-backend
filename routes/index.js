const express = require('express');
const router = express.Router();
const giphyClient  = require('../clients/giphyClient');
const fsc  = require('../clients/FreeSoundClient');
const freeSoundClient  = new fsc();

router.get('/', function(req, res, next) {
  return res.json({});
});

router.get('/gif/search', function(req, res, next) {
  giphyClient.search(req.query.q,req.query.limit || 42 ).then((response) =>{
    return res.json(response);
  })
});

router.get('/sound/search', function(req, res, next) {
  req.query.query = req.query.q;
  const queryString = Object.entries(req.query).map(([key,value]) => `${key}=${value}`).join('&');
  freeSoundClient.search(queryString).then((response) =>{
    return res.json(response);
  })
});

module.exports = router;
