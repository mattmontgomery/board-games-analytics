import { BggClient } from "boardgamegeekclient";
import path from "path";

type Games = Awaited<ReturnType<BggClient["thing"]["query"]>>;

async function main(filename: string = "top-1000.json") {
  console.log(filename);
  const games = (await import(path.resolve(filename)))
    .default as unknown as Games;
  console.log(
    games
      .flatMap((game) => {
        return game.links
          .filter((link) => link.type === "boardgamemechanic")
          .map((link) =>
            [
              game.id,
              `"${game.name}"`,
              game.yearpublished,
              `"${link.value}"`,
            ].join(",")
          );
      })
      .join(",\n")
  );
}

main(process.argv[2] as string);
