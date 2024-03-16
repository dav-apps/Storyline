import { Injectable } from "@angular/core"
import * as localforage from "localforage"
import {
	settingsThemeKey,
	settingsThemeDefault,
	settingsActivateNotificationsCardClosedKey,
	settingsActivateNotificationsCardClosedDefault
} from "src/app/constants"

@Injectable()
export class SettingsService {
	cache: {
		[key: string]: any
	} = {}

	//#region Theme
	async setTheme(value: string) {
		await localforage.setItem(settingsThemeKey, value)
		this.cache[settingsThemeKey] = value
	}

	async getTheme(): Promise<string> {
		return this.getSetting<string>(settingsThemeKey, settingsThemeDefault)
	}
	//#endregion

	//#region ActivateNotificationsCardClosed
	async setActivateNotificationsCardClosed(value: boolean) {
		await localforage.setItem(
			settingsActivateNotificationsCardClosedKey,
			value
		)
		this.cache[settingsActivateNotificationsCardClosedKey] = value
	}

	async getActivateNotificationsCardClosed(): Promise<boolean> {
		return this.getSetting<boolean>(
			settingsActivateNotificationsCardClosedKey,
			settingsActivateNotificationsCardClosedDefault
		)
	}
	//#endregion

	private async getSetting<T>(key: string, defaultValue: T): Promise<T> {
		let cachedValue = this.cache[key]
		if (cachedValue != null) return cachedValue

		let value = (await localforage.getItem(key)) as T
		if (value == null) value = defaultValue

		this.cache[key] = value
		return value
	}
}
