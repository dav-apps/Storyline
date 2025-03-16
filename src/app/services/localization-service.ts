import { Injectable, Inject, PLATFORM_ID } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import * as locales from "src/locales/locales"

@Injectable()
export class LocalizationService {
	locale = locales.enUS

	constructor(@Inject(PLATFORM_ID) private platformId: object) {
		this.locale = this.getLocale(
			isPlatformBrowser(this.platformId) ? navigator.language : null
		)
	}

	getLocale(language?: string) {
		if (language == null) return locales.enUS

		const locale = language.toLowerCase()

		if (locale.startsWith("en")) {
			if (locale == "en-gb") return locales.enGB
			return locales.enUS
		} else if (locale.startsWith("de")) {
			if (locale == "de-at") return locales.deAT
			if (locale == "de-ch") return locales.deCH
			return locales.deDE
		}

		return locales.enUS
	}
}
