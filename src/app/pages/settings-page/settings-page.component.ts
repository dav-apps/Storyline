import { Component } from "@angular/core"
import { DropdownOption, DropdownOptionType } from "dav-ui-components"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { SettingsService } from "src/app/services/settings-service"
import {
	version,
	systemThemeKey,
	lightThemeKey,
	darkThemeKey
} from "src/app/constants"

@Component({
	templateUrl: "./settings-page.component.html",
	styleUrl: "./settings-page.component.scss"
})
export class SettingsPageComponent {
	locale = this.localizationService.locale.settingsPage
	version = version
	year = new Date().getFullYear()
	selectedTheme: string = systemThemeKey
	themeDropdownOptions: DropdownOption[] = [
		{
			key: systemThemeKey,
			value: this.locale.systemTheme,
			type: DropdownOptionType.option
		},
		{
			key: lightThemeKey,
			value: this.locale.lightTheme,
			type: DropdownOptionType.option
		},
		{
			key: darkThemeKey,
			value: this.locale.darkTheme,
			type: DropdownOptionType.option
		}
	]

	constructor(
		private dataService: DataService,
		private localizationService: LocalizationService,
		private settingsService: SettingsService
	) {
		this.dataService.setMeta({ url: "settings" })
	}

	async ngOnInit() {
		this.selectedTheme = await this.settingsService.getTheme()
	}

	async themeDropdownChange(event: Event) {
		let selectedKey = (event as CustomEvent).detail.key

		this.selectedTheme = selectedKey
		await this.settingsService.setTheme(selectedKey)
		await this.dataService.loadTheme()
	}
}
