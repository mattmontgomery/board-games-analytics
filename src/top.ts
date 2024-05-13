import { OptionValues, program } from "commander";
import puppeteer, { Page } from "puppeteer";

const BGG_BASE_URL = `https://boardgamegeek.com/search/boardgame/page/:page?sort=rank&advsearch=1&searchuser=moonty&playerrangetype=normal&propertyids[0]=2023&B1=Submit`;

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
  for (let i = 0; i < 10; i++) {
    const url = BGG_BASE_URL.replace(`:page`, String(i + 1));
    await page.goto(url);
    const games = await parseGameList(page);
    console.log(
      games.map((game) => Object.values(game ?? {}).join(",")).join("\n")
    );
  }
  process.exit(0);
  //   await page.goto("https://boardgamegeek.com/browse/boardgame/page/2");
}

async function parseGameList(page: Page) {
  return await page.evaluate(() => {
    return [...document.querySelectorAll("tr")]
      .slice(1)
      .map((row) => {
        const rank = row
          .querySelector(".collection_rank")
          ?.textContent?.replace(/^[\n\t]+/, "")
          ?.replace(/[\n\t]+$/, "");
        const title = row.querySelector(
          ".collection_objectname .primary"
        )?.textContent;
        const url = row.querySelector<HTMLAnchorElement>(
          ".collection_objectname .primary"
        )?.href;

        const year = row
          .querySelector(".collection_objectname .dull")
          ?.textContent?.replace(/[\(\)]+/g, "");
        if (!rank) {
          return null;
        }
        return {
          url: String(url),
          id: url?.match(/\/\d+\//i)?.[0]?.replace(/\//g, ""),
          rank: Number(rank),
          title,
          year: Number(year),
        };
      })
      .filter(Boolean);
  });
}

main(options);
