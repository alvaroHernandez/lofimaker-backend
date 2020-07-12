require('dotenv').config();
const client = require("./baseClient");

function search(query){
  return client.makeRequest(
    `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&limit=25&offset=0&rating=G&lang=en&q=${query}`,
  );
}

exports.search = search;
