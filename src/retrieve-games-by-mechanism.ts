import { OptionValues, program } from "commander";
import puppeteer, { Page } from "puppeteer";

const DEFAULT_MECHANISM_ID = 41222;

const BGG_BASE_URL = `https://boardgamegeek.com/boardgamefamily/:mechanismId/mechanism-roll-and-write/linkeditems/boardgamefamily?pageid=:page&sort=rank`;

program.option<number>(
  "count",
  "Number of results to retrieve",
  (arg) => Number(arg),
  1000
);
program.option<number>(
  "mechanismId",
  "Mechanism ID to retrieve",
  (arg) => Number(arg),
  DEFAULT_MECHANISM_ID
);

program.parse();

async function main(options: OptionValues) {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  for (let i = 0; i < 25; i++) {
    const url = BGG_BASE_URL.replace(`:page`, String(i + 1)).replace(
      ":mechanismId",
      options.mechanismId
    );
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
    return [...document.querySelectorAll("li.summary-item")]
      .map((row) => {
        const rank = row
          .querySelector(".text-muted")
          ?.textContent?.match(/Rank: (\d+)/g)?.[0]
          .replace("Rank: ", "");
        const title = row.querySelector(".summary-item-title")?.textContent;
        const url = row.querySelectorAll<HTMLAnchorElement>("a")[0]?.href;

        const year = title
          ?.match(/\(\d+\)/)?.[0]
          ?.replace("(", "")
          .replace(")", "");
        return {
          url: String(url),
          id: url?.match(/\/\d+\//i)?.[0]?.replace(/\//g, ""),
          rank: Number(rank),
          title: `"${
            title
              ?.replace(/\(\d+\)/, "")
              ?.trim()
              ?.replace(/[\t\n]/g, "") ?? ""
          }"`,
          year: Number(year),
        };
      })
      .filter(Boolean);
  });
}

main(program.opts());
