import { Injectable } from "@angular/core"
import * as locales from "../../locales/locales"

@Injectable()
export class LocalizationService {
	locale = locales.enUS

	constructor() {
		this.locale = this.getLocale(navigator.language)
	}

	getLocale(language: string) {
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
