const  { getAll, getLoFi, createLoFi, voteLoFi } = require("../repositories/lofiRepository");
const express = require('express');
const router = express.Router();
const giphyClient  = require('../clients/giphyClient');
const fsc  = require('../clients/FreeSoundClient');
const freeSoundClient  = new fsc();
const xss = require("xss");

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

router.get('/lofi', async function(req, res, next) {
  const { data } = await getAll(req.params.id);
  return res.status(200).json(data.map(lofi => ({ id : lofi.ref.id, ...lofi.data})));
});

router.get('/lofi/:id', async function(req, res, next) {
  try {
    const { data } = await getLoFi(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    if (e.requestResult) {
      if (e.requestResult.statusCode === 404) {
        return res.status(404).json({message: "not found"});
      } else if (e.requestResult.statusCode === 400) {
        return res.status(400).json({message: "bad request"});
      }
      console.warn(e);
      return res.status(400).json({message: "unexpected error"});
    }
  }
});

router.post('/lofi', async function(req, res, next) {
  try{
    const loFi = JSON.parse(xss(JSON.stringify(req.body)));
    const result = await createLoFi(loFi);
    return res.status(200).json(result);
  }catch (e) {
    console.warn(e);
    res.status(500).json({ message: "unexpected error" })
  }
});

router.post('/lofi/:id/vote', async function(req, res){
  try{
    const result = await voteLoFi(req.params.id);
    return res.status(200).json(result);
  }catch (e) {
    console.warn(e);
    res.status(500).json({ message: "unexpected error" })
  }
});

module.exports = router;
