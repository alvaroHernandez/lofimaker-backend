const freeSound = require('freesound');
require('dotenv').config();
const fetch = require('node-fetch');

module.exports = class FreeSoundClient {
  constructor() {
    freeSound.setToken(process.env.FREE_SOUND_API_KEY);
  }

  composeTrackInfo(trackInfo) {
    try {
      return {
        id: trackInfo.id,
        title: trackInfo.name,
        duration: trackInfo.duration * 1000,
        stream_url: trackInfo.previews['preview-hq-mp3'],
        artwork_url: trackInfo.images.waveform_m,
      };
    } catch (e) {
      console.log(e);
    }
  }
  search(queryString) {
    const freeSoundQuery = `https://freesound.org/apiv2/search/text/?fields=id,description,name,duration,previews,images&token=${process.env.FREE_SOUND_API_KEY}&${queryString}`;
    return fetch(freeSoundQuery).then(async response => {
      if (response.ok) {
        const json = await response.json();
        return json.results.map(r => this.composeTrackInfo(r));
      }
    });
  }
};
