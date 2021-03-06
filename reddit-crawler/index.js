const puppeteer = require('puppeteer');
const Sheet = require('./sheet');

const url =
  'https://old.reddit.com/r/learnprogramming/comments/4q6tae/i_highly_recommend_harvards_free_online_2016_cs50/';

(async function () {
  const browser = await puppeteer.launch({
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
    ],
    executablePath: '/usr/bin/chromium-browser',
  });
  const page = await browser.newPage();
  await page.goto(url);

  const sheet = new Sheet();
  await sheet.load();

  // create sheet with title
  const title = await page.$eval('.title a', (el) => el.textContent);
  const sheetIndex = await sheet.addSheet(title.slice(0, 99), [
    'points',
    'text',
  ]);

  // expand all comment threads
  let expandButtons = await page.$$('.morecomments');
  while (expandButtons.length) {
    for (let button of expandButtons) {
      await button.click();
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(1000);
    expandButtons = await page.$$('.morecomments');
  }

  // select all comments, scrape text and points
  const comments = await page.$$('.entry');
  const formattedComments = [];
  for (let comment of comments) {
    //scrape points
    const points = await comment
      .$eval('.score', (el) => el.textContent)
      .catch((err) => console.error('no score'));

    //scrape text
    const rawText = await comment
      .$eval('.usertext-body', (el) => el.textContent)
      .catch((err) => console.error('no text'));

    if (points && rawText) {
      const text = rawText.replace(/\n/g, '');
      formattedComments.push({ points, text });
    }
  }

  // sort comments by points
  formattedComments.sort((a, b) => {
    const pointsA = Number(a.points.split(' ')[0]);
    const pointsB = Number(b.points.split(' ')[0]);
    return pointsB - pointsA;
  });

  // insert into google spreadsheet
  sheet.addRows(formattedComments, sheetIndex);

  await browser.close();
})();
