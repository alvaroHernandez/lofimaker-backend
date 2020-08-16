require('dotenv').config()
const faunadb = require('faunadb');

const client = new faunadb.Client({ secret: process.env.FAUNADB_KEY });
const q = faunadb.query;

module.exports.client = client;
module.exports.q = q;
