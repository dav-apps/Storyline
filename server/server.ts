import * as path from "path"
import express, { Request, Response } from "express"
import { createServer } from "http"
import {
	generateSitemap,
	prepareArticlePage,
	preparePublisherPage
} from "./index.js"

const app = express()
const http = createServer(app)

app.get("/sitemap.txt", async (req, res) => {
	res.setHeader("Content-Type", "text/plain")
	res.send(await generateSitemap())
})

app.get("/article/:uuid", async (req: Request, res: Response) => {
	let result = await prepareArticlePage(req.params.uuid)
	res.status(result.status).send(result.html)
})

app.get("/publisher/:uuid", async (req: Request, res: Response) => {
	let result = await preparePublisherPage(req.params.uuid)
	res.status(result.status).send(result.html)
})

function getRoot(req: Request, res: Response) {
	res.sendFile(path.resolve("./storyline/browser/index.html"))
}

app.use(express.static("./storyline/browser"))

app.get("/", getRoot)
app.get("/*", getRoot)

http.listen(process.env.PORT || 3004)
