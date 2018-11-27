"use latest";

import rp from "request-promise-native";
import { Url, URL } from "url";
import _ from "lodash";
import Parser from "rss-parser";
const parser = new Parser();

/**
 * @param context {WebtaskContext}
 */
async function start(context: any, cb: Function) {
  const forums = [
    "https://forums.galaxy-of-heroes.starwars.ea.com/categories/news-and-announcements-/feed.rss",
    "https://forums.galaxy-of-heroes.starwars.ea.com/categories/game-updates/feed.rss"
  ];

  let rssData: any[] = [];
  let storedGuids: any[];
  context.storage.get((error: any, data: any) => {
    if (error) return cb(error);
    storedGuids = data;
  });
  const getData = async () => {
    await asyncForEach(forums, async (forum: string) => {
      let feed = await parser.parseURL(forum);
      //@ts-ignore
      console.log("start dat feed doe", feed.items[0].guid);
      const newFeedItems = _.differenceBy(
        feed.items,
        storedGuids,
        (item: any, guid: any) => {
          return item.guid !== guid;
        }
      );
      //@ts-ignore
      rssData.push(newFeedItems);
    });
  };
  getData();

  console.log(rssData);
}

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = start;
