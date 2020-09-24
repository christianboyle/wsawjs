const puppeteer = require('puppeteer');
const secrets = require('./secrets');

(async () => {
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
    headless: false,
    executablePath: '/usr/bin/chromium-browser',
  });
  const page = await browser.newPage();
  await page.goto('https://instagram.com');

  await page.waitForSelector('input');

  const inputs = await page.$$('input');
  await inputs[0].type(secrets.USERNAME);
  await inputs[1].type(secrets.PASSWORD);

  const logInButton = (await page.$$('button'))[1];

  logInButton.click();

  await page.waitForNavigation();

  const USERNAME = 'nojumper';
  await page.goto(`https://instagram.com/${USERNAME}`);

  await page.waitForSelector('article a');

  await (await page.$('article a')).click();

  await page.waitForTimeout(1000);

  await (await page.$$('button'))[5].click();

  //await browser.close();
})();
