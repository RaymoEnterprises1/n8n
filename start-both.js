const { exec } = require('child_process');

exec('pnpm run start-scraper', (err, stdout, stderr) => {
  if (err) console.error('Scraper error:', err);
  if (stdout) console.log('Scraper output:', stdout);
  if (stderr) console.error('Scraper stderr:', stderr);
});

exec('pnpm start', (err, stdout, stderr) => {
  if (err) console.error('n8n error:', err);
  if (stdout) console.log('n8n output:', stdout);
  if (stderr) console.error('n8n stderr:', stderr);
});
