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
    //headless: false,
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

  const USERNAMES = ['stevie_churchill', 'brandonbegin', 'reynoldsfiend'];

  for (let USERNAME of USERNAMES) {
    await page.goto(`https://instagram.com/${USERNAME}`);
    await page.waitForSelector('img');
    const imgSrc = await page.$eval('img', (el) => el.getAttribute('src'));
    const headerData = await page.$$eval('header li', (els) =>
      els.map((el) => el.textContent)
    );
    const name = await page
      .$eval('header h1', (el) => el.textContent)
      .catch((err) => true);

    const desc = await page
      .$eval('.-vDIg span', (el) => el.textContent)
      .catch((err) => true);

    const link = await page
      .$eval('.-vDIg a', (el) => el.textContent)
      .catch((err) => true);

    const profile = { imgSrc, headerData, name, desc, link };

    console.log({ profile });
  }

  //await browser.close();
})();
