import * as request from "request";
import { load } from "cheerio";
import { replaceAll } from "voca";

/**
 *
 * @returns HTML Body
 */
const getBody = () =>
  new Promise<string>((resolve, reject) => {
    request.get("https://www.melon.com/chart/", (err, res) => {
      if (err) reject(err);
      resolve(res.body);
    });
  });

const crawl = async () => {
  const html = await getBody();
  if (html === "") return [];

  const $ = load(html);
  const $song_table = $("div.service_list_song table tbody").children("tr");

  const chart: object = $song_table
    .map((_, element) => {
      return {
        rank: $(element).find("span.rank").text(),
        title: removeEscape($(element).find("div.rank01").text()),
        artist: removeEscape($(element).find("div.rank02 span").text()),
      };
    })
    .get();

  return chart;
};

/**
 *
 * @param text
 * @returns string \t \n removed
 */
function removeEscape(text: string) {
  const escape = ["\n", "\t"];

  return escape.reduce((result, char) => {
    return replaceAll(result, char, "");
  }, text);
}

export default crawl;
