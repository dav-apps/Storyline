import * as path from "path"
import express, { Request, Response } from "express"
import { createServer } from "http"

const app = express()
const http = createServer(app)

function getRoot(req: Request, res: Response) {
	res.sendFile("./storyline/browser/index.html")
}

app.use(express.static("./storyline/browser"))

app.get("/", getRoot)
app.get("/*", getRoot)

http.listen(process.env.PORT || 3004)
