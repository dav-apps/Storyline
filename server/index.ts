import * as path from "path"
import * as fs from "fs"
import { JSDOM } from "jsdom"
import { request, gql } from "graphql-request"

let backendUrl = "http://localhost:4004"
let websiteUrl = "http://localhost:3004"

switch (process.env.ENV) {
	case "production":
		backendUrl = "https://storyline-api-staging-85btq.ondigitalocean.app/"
		websiteUrl = "https://storyline-staging-a6ylk.ondigitalocean.app/"
		break
	case "staging":
		backendUrl = "https://storyline-api-staging-85btq.ondigitalocean.app/"
		websiteUrl = "https://storyline-staging-a6ylk.ondigitalocean.app/"
		break
}

export async function prepareArticlePage(uuid: string): Promise<string> {
	try {
		let response = await request<{
			retrieveArticle: {
				title: string
				description: string
				imageUrl: string
			}
		}>(
			backendUrl,
			gql`
				query RetrieveArticle($uuid: String!) {
					retrieveArticle(uuid: $uuid) {
						title
						description
						imageUrl
					}
				}
			`,
			{ uuid }
		)

		let responseData = response.retrieveArticle

		return getHtml({
			title: responseData.title,
			description: responseData.description,
			imageUrl: responseData.imageUrl,
			url: `${websiteUrl}/article/${uuid}`
		})
	} catch (error) {
		console.error(error)
		return getHtml()
	}
}

function getHtml(params?: {
	title: string
	description: string
	imageUrl: string
	url: string
}) {
	// Read the html file
	let index = fs.readFileSync(path.resolve("./storyline/browser/index.html"), {
		encoding: "utf8"
	})

	if (params != null) {
		const dom = new JSDOM(index)
		let html = dom.window.document.querySelector("html")
		let head = html.querySelector("head")

		let metas: { name?: string; property?: string; content: string }[] = [
			// Twitter tags
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:site", content: "@dav_apps" },
			{ name: "twitter:title", content: params.title },
			{ name: "twitter:description", content: params.description },
			{ name: "twitter:image", content: params.imageUrl },
			// Open Graph tags
			{ property: "og:title", content: params.title },
			{ property: "og:image", content: params.imageUrl },
			{ property: "og:url", content: params.url }
		]

		for (let metaObj of metas) {
			if (metaObj.content == null) continue

			// Check if a meta tag with the name or property already exists
			let meta: any

			if (metaObj.name != null) {
				meta = dom.window.document.querySelector(
					`meta[name='${metaObj.name}']`
				)
			} else if (metaObj.property != null) {
				meta = dom.window.document.querySelector(
					`meta[property='${metaObj.property}']`
				)
			}

			if (meta == null) {
				meta = dom.window.document.createElement("meta")

				if (metaObj.name != null) {
					meta.setAttribute("name", metaObj.name)
				} else if (metaObj.property != null) {
					meta.setAttribute("property", metaObj.property)
				}

				meta.setAttribute("content", metaObj.content)
				head.appendChild(meta)
			} else {
				meta.setAttribute("content", metaObj.content)
			}
		}

		return html.outerHTML
	}

	return index
}
