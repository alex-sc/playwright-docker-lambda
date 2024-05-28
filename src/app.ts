import express, { Request, Response } from "express";
import playwright = require('playwright');
import { Server } from "node:http";
import { AddressInfo } from "node:net";
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

async function getPagePdf(url: string){
  const browser = await playwright.chromium.launch({headless: false});

  const page = await browser.newPage();
  await page.goto(url);

  const pdf = await page.pdf();

  await browser.close();

  return pdf;
}


let server: Server;
export async function start(port: number | string): Promise<Server> {
  return new Promise((resolve) => {
    server = app
        .listen(port, () => {
          const address = server.address() as AddressInfo;
          console.info(`Listening on http://localhost:${address.port}`);
          ["SIGTERM", "SIGINT"].forEach((signal): void => {
            process.on(signal, stop);
          });
          resolve(server);
        })
        .on("close", () => {
          console.info("Server connection closed");
        })
        .on("error", async (error) => {
          await stop(error);
        });
  });
}
export async function stop(signal?: string | Error): Promise<void> {
  if (signal instanceof Error) {
    process.exitCode = 1;
    console.error(`error: ${signal.message}`);
    console.error("stop (error)");
  } else {
    if (signal) {
      console.info(`stop (${signal})`);
    } else {
      console.info("stop");
    }
  }
  if (server) {
    try {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          err ? reject(err) : resolve();
        });
      });
    } catch (error: any) {
      process.exitCode = 1;
      console.error(error.message);
    }
  }
  console.info("Server stopped");
}

// If this module is the main module, then start the server
if (import.meta.url.endsWith(process.argv[1]!)) {
  const port = process.env["PORT"] || "8080";
  await start(port);
}
