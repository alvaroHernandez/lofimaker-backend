const freeSound = require('freesound');
require('dotenv').config();
const fetch = require('node-fetch');

module.exports = class FreeSoundClient {
  constructor() {
    freeSound.setToken(process.env.FREE_SOUND_API_KEY);
  }

  async composeTrackInfo(id) {
    const getSound = a => new Promise((r, e) => freeSound.getSound(a, r, e));
    try {
      const json = JSON.parse(await getSound(id));
      return {
        id: json.id,
        title: json.description.substring(0, 25) + '...',
        duration: json.duration * 1000,
        stream_url: json.previews['preview-hq-mp3'],
        artwork_url: json.images.waveform_m,
      };
    } catch (e) {
      console.log(e);
    }
  }

  search(query) {
    return fetch(
      `https://freesound.org/apiv2/search/text/?token=${process.env.FREE_SOUND_API_KEY}&query=${query}`,
    ).then(async response => {
      if (response.ok) {
        const json = await response.json();
        return (
          await Promise.all(
            json.results.map(async r => this.composeTrackInfo(r.id)),
          )
        ).filter(e => e !== undefined);
      }
    });
  }
};
