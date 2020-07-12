require('dotenv').config();
const client = require("./baseClient");

function search(query,limit){
  return client.makeRequest(
    `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&limit=${limit}&offset=0&rating=G&lang=en&q=${query}`,
  );
}

exports.search = search;
