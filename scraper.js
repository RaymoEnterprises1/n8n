const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.card-listing');

    const prices = await page.$$eval('.card-listing .price', els =>
      els
        .map(el => parseFloat(el.textContent.replace(/[^\d.]/g, '')))
        .filter(n => !isNaN(n))
    );

    await browser.close();

    if (!prices.length) {
      return res.status(200).json({ avg: null, low: null, high: null });
    }

    prices.sort((a, b) => a - b);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

    res.json({
      avg: avg.toFixed(2),
      low: prices[0],
      high: prices[prices.length - 1]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

app.listen(3001, () => console.log('🧲 Scraper running on port 3001'));
