import { OptionValues, program } from "commander";
import puppeteer, { Page } from "puppeteer";

const BGG_BASE_URL = `https://boardgamegeek.com/geeksearch.php?action=search&advsearch=1&objecttype=boardgame&q=&include%5Bdesignerid%5D=&geekitemname=&geekitemname=&include%5Bpublisherid%5D=&range%5Byearpublished%5D%5Bmin%5D=:year&range%5Byearpublished%5D%5Bmax%5D=:year&range%5Bminage%5D%5Bmax%5D=&floatrange%5Bavgrating%5D%5Bmin%5D=&floatrange%5Bavgrating%5D%5Bmax%5D=&range%5Bnumvoters%5D%5Bmin%5D=&floatrange%5Bavgweight%5D%5Bmin%5D=&floatrange%5Bavgweight%5D%5Bmax%5D=&range%5Bnumweights%5D%5Bmin%5D=&colfiltertype=&searchuser=moonty&range%5Bminplayers%5D%5Bmax%5D=&range%5Bmaxplayers%5D%5Bmin%5D=&playerrangetype=normal&range%5Bleastplaytime%5D%5Bmin%5D=&range%5Bplaytime%5D%5Bmax%5D=&B1=Submit`;

program.option<number>(
  "count",
  "Number of results to retrieve",
  (arg) => Number(arg),
  1000
);
program.parse();

const options = program.opts();

async function main(options: OptionValues) {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  for (let i = 1980; i <= 1980; i++) {
    const url = BGG_BASE_URL.replace(`:year`, String(i + 1));
    await page.goto(url);
    const count = await page.evaluate(() => {
      const pages = document.querySelector('a[title="last page"]');
      console.log({ pages });
      return pages?.textContent;
    });
    console.log(count);
  }
  process.exit(0);
  //   await page.goto("https://boardgamegeek.com/browse/boardgame/page/2");
}

main(options);
