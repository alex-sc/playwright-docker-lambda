"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const playwright = require("playwright");
const node_process_1 = __importDefault(require("node:process"));
exports.app = (0, express_1.default)();
exports.app.head("*", (req, res) => {
    res.contentType("text/plain");
    res.send("Ok");
});
exports.app.get("/", async (req, res) => {
    const url = req.query.url ?? "https://google.com";
    try {
        const pdfBuffer = await getPagePdf(url.toString());
        res.contentType("application/pdf");
        res.send(pdfBuffer);
    }
    catch (e) {
        res.contentType("text/plain");
        res.status(500).send(e.toString());
    }
});
async function getPagePdf(url) {
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    const pdf = await page.pdf();
    await browser.close();
    return pdf;
}
const port = node_process_1.default.env["PORT"] || "8080";
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
