import * as path from "path"
import express, { Request, Response } from "express"
import { createServer } from "http"
import { prepareArticlePage } from "./index.js"

const app = express()
const http = createServer(app)

app.get("/article/:uuid", (req: Request, res: Response) => {
	let uuid = req.params.uuid
	prepareArticlePage(uuid).then(result => res.send(result))
})

function getRoot(req: Request, res: Response) {
	res.sendFile(path.resolve("./storyline/browser/index.html"))
}

app.use(express.static("./storyline/browser"))

app.get("/", getRoot)
app.get("/*", getRoot)

http.listen(process.env.PORT || 3004)
