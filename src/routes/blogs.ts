import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();
const url = "https://www.euronews.com/tag/fitness";

router.get("/blogs", async (req, res) => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto(url);

  // Query for an element handle.
  const data = await page.evaluate(() => {
    const images = document.querySelectorAll("figure > a > img");
    //titles are links
    const titles = document.querySelectorAll("a.m-object__title__link");
    // const descriptions = document.querySelectorAll(
    //   "a.m-object__description__link"
    // );
    const imageSources = Array.from(images).map((el) => (el as any).src);
    const titlesArray = Array.from(titles).map((el) => el.innerHTML.trim());
    // const descriptionsArray = Array.from(descriptions).map((el) =>
    //   el.innerHTML.trim()
    // );

    function normalize(
      array1: any[],
      array2: any[]
      // array3
    ) {
      let results = [];
      for (let i = 0; i < array1.length; i++) {
        results.push({
          id: i,
          image: array1[i],
          title: array2[i],
          // description: array3[i],
        });
      }
      return results;
    }

    return normalize(
      imageSources,
      titlesArray
      // descriptionsArray
    );
  });

  // Close browser.
  await browser.close();

  res.json({ data });
});

export default router;
