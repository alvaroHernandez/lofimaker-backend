const express = require('express');
const router = express.Router();
const giphyClient  = require('../clients/giphyClient');
const fsc  = require('../clients/FreeSoundClient');
const freeSoundClient  = new fsc();

router.get('/', function(req, res, next) {
  return res.json({});
});

router.get('/gifs/search', function(req, res, next) {
  giphyClient.search(req.query.q).then((response) =>{
    return res.json(response);
  })
});

router.get('/sounds/search', function(req, res, next) {
  freeSoundClient.search(req.query.q).then((response) =>{
    return res.json(response);
  })
});

module.exports = router;
