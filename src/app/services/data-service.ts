import { Injectable } from "@angular/core"
import { Dav, PromiseHolder } from "dav-js"
import * as DavUIComponents from "dav-ui-components"
import { SettingsService } from "./settings-service"
import { ArticleResource, Theme } from "../types"
import { convertStringToTheme, isClient, isServer } from "../utils"
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
	bookmarksCount: number = 0
	startPagePosition: number = 0
	startPageOffset: number = 0
	startPageArticles: ArticleResource[] = []

	constructor(private settingsService: SettingsService) {}

	async loadTheme(theme?: Theme) {
		if (isServer()) return

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
		if (isClient() && navigator.language.startsWith("de")) {
			return ["de", "en"]
		}

		return ["en"]
	}
}
