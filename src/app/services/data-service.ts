import { Injectable, Inject, PLATFORM_ID } from "@angular/core"
import { DOCUMENT, isPlatformBrowser, isPlatformServer } from "@angular/common"
import { Title, Meta } from "@angular/platform-browser"
import { Dav, PromiseHolder } from "dav-js"
import * as DavUIComponents from "dav-ui-components"
import { SettingsService } from "./settings-service"
import { ArticleResource, Theme } from "../types"
import { convertStringToTheme } from "../utils"
import { darkThemeKey, lightThemeKey, themeKey } from "../constants"

@Injectable()
export class DataService {
	dav = Dav
	userPromiseHolder = new PromiseHolder()
	userIsAdmin: boolean = false
	darkTheme: boolean = false
	contentContainer: HTMLDivElement = null
	loadingScreenVisible: boolean = false
	isMobile: boolean = false
	updateInstalled: boolean = false
	bookmarksCount: number = 0
	startPagePosition: number = 0
	startPageOffset: number = 0
	startPageArticles: ArticleResource[] = []

	constructor(
		private settingsService: SettingsService,
		private title: Title,
		private meta: Meta,
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: object
	) {}

	async loadTheme(theme?: Theme) {
		if (isPlatformServer(this.platformId)) return

		if (theme == null) {
			// Get the theme from the settings
			theme = convertStringToTheme(await this.settingsService.getTheme())
		}

		switch (theme) {
			case Theme.Dark:
				this.darkTheme = true
				break
			case Theme.System:
				// Get the browser theme
				let darkTheme = false

				if (window.matchMedia) {
					let colorScheme = window.matchMedia(
						"(prefers-color-scheme: dark)"
					)

					darkTheme = colorScheme.matches
					colorScheme.onchange = () => this.loadTheme()
				}

				this.darkTheme = darkTheme
				break
			default:
				this.darkTheme = false
				break
		}

		document.body.setAttribute(
			themeKey,
			this.darkTheme ? darkThemeKey : lightThemeKey
		)

		DavUIComponents.setTheme(
			this.darkTheme
				? DavUIComponents.Theme.dark
				: DavUIComponents.Theme.light
		)
	}

	getLanguages() {
		if (
			isPlatformBrowser(this.platformId) &&
			navigator.language.startsWith("de")
		) {
			return ["de", "en"]
		}

		return ["en"]
	}

	setMeta(params?: {
		title?: string
		description?: string
		twitterCard?: string
		image?: string
		url?: string
	}) {
		const title = params?.title ?? "Storyline"
		const description =
			params?.description ?? "The one place to get all your news"
		const twitterCard = params?.twitterCard ?? "summary"
		const image = params?.image ?? "/assets/icons/icon-192.png"
		const url = params?.url ?? ""
		const absoluteUrl = `https://storyline.press/${url}`

		this.title.setTitle(title)
		this.meta.updateTag({ content: description }, "name='description'")
		this.meta.updateTag({ content: twitterCard }, "name='twitter:card'")
		this.meta.updateTag({ content: title }, "name='twitter:title'")
		this.meta.updateTag(
			{ content: description },
			"name='twitter:description'"
		)
		this.meta.updateTag({ content: image }, "name='twitter:image'")

		this.meta.updateTag({ content: title }, "property='og:title'")
		this.meta.updateTag({ content: image }, "property='og:image'")
		this.meta.updateTag({ content: absoluteUrl }, "property='og:url'")

		let canonicalLinkTag = this.document.querySelector(
			"link[rel='canonical']"
		)

		if (canonicalLinkTag != null) {
			canonicalLinkTag.setAttribute("href", absoluteUrl)
		}
	}
}
