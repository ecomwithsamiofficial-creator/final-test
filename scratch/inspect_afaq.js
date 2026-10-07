const https = require('https');

https.get('https://learnwithafaq.com', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const idx = data.indexOf('128 SECONDS');
    if (idx !== -1) {
      console.log('Hero Video Snippet:');
      console.log(data.substring(idx - 200, idx + 1800));
    } else {
      console.log('Not found "128 SECONDS", searching "Ecommstory":');
      const idx2 = data.indexOf('Ecommstory');
      console.log(data.substring(idx2 - 200, idx2 + 1800));
    }
  });
});
