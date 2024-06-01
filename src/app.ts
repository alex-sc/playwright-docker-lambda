import express, { Request, Response } from "express";
import playwright = require('playwright');
import process from "node:process";

export const app = express();

app.head("*", (req: Request, res: Response): void => {
  res.contentType("text/plain");
  res.send("Ok");
});

app.get("/", async (req: Request, res: Response): Promise<void> => {
  const url = req.query.url ?? "https://google.com";

  try {
    const pdfBuffer = await getPagePdf(url.toString());

    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (e) {
    res.contentType("text/plain");
    res.status(500).send(e.toString());
  }
});

exports.handler = async (event) => {
  const pdfBuffer = await getPagePdf("https://google.com");

  return {
    'headers': { "Content-Type": "application/pdf" },
    'statusCode': 200,
    'body': pdfBuffer.toString("base64"),
    'isBase64Encoded': true
  }
};


async function getPagePdf(url: string){
  const browser = await playwright.chromium.launch({headless: false});

  const page = await browser.newPage();
  await page.goto(url);

  const pdf = await page.pdf();

  await browser.close();

  return pdf;
}


const port = process.env["PORT"] || "8080";
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
