"use strict";
"use latest";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const parser = new rss_parser_1.default();
/**
 * @param context {WebtaskContext}
 */
async function start(context, cb) {
  const forums = [
    "https://forums.galaxy-of-heroes.starwars.ea.com/categories/news-and-announcements-/feed.rss",
    "https://forums.galaxy-of-heroes.starwars.ea.com/categories/game-updates/feed.rss"
  ];
  let rssData = [];
  let storedGuids;
  context.storage.get((error, data) => {
    if (error) return cb(error);
    storedGuids = data;
  });
  const getData = async () => {
    await asyncForEach(forums, async forum => {
      let feed = await parser.parseURL(forum);
      //@ts-ignore
      console.log("start dat feed doe", feed.items[0].guid);
      const newFeedItems = lodash_1.default.differenceBy(
        feed.items,
        storedGuids,
        (item, guid) => {
          console.log(
            "comparing two guids",
            item.guid,
            "!==",
            guid,
            "=",
            item.guid !== guid
          );
          return item.guid !== guid;
        }
      );
      //@ts-ignore
      console.log("dat new feed item doe", newFeedItems);
      rssData.push(newFeedItems);
    });
  };
  console.log("derp");
  getData();
  console.log(rssData);
}
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
module.exports = start;
