const puppeteer = require('puppeteer');


(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.tracing.start({path: '/tmp/hello-puppeteer1-trace.json'});
    await page.goto('https://www.google.com');
    await page.tracing.stop();
    await page.screenshot({path: '/tmp/hello-puppeteer1.png'});
    browser.close();
})();
