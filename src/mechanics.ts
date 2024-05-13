import { BggClient } from "boardgamegeekclient";
import top1000 from "../data/top-1000.json";

type Games = Awaited<ReturnType<BggClient["thing"]["query"]>>;

async function main(games: Games) {
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

main(top1000 as unknown as Games);
