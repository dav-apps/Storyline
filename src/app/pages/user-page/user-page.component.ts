import { Component } from "@angular/core"
import {
	faRotate as faRotateLight,
	faPlus as faPlusLight,
	faGem as faGemLight
} from "@fortawesome/pro-light-svg-icons"
import { Dav } from "dav-js"
import { DataService } from "../../services/data-service"
import { LocalizationService } from "../../services/localization-service"
import { bytesToGigabytesText } from "../../utils"
import { environment } from "../../../environments/environment"

@Component({
	templateUrl: "./user-page.component.html",
	styleUrl: "./user-page.component.scss"
})
export class UserPageComponent {
	locale = this.localizationService.locale.userPage
	faRotateLight = faRotateLight
	faPlusLight = faPlusLight
	faGemLight = faGemLight
	websiteUrl = environment.websiteUrl
	usedStoragePercent: number = 0
	usedStorageText: string = ""

	constructor(
		public dataService: DataService,
		private localizationService: LocalizationService
	) {}

	async ngOnInit() {
		await this.dataService.userPromiseHolder.AwaitResult()

		this.usedStoragePercent =
			(this.dataService.dav.user.UsedStorage /
				this.dataService.dav.user.TotalStorage) *
			100

		this.usedStorageText = this.locale.storageUsed
			.replace(
				"{0}",
				bytesToGigabytesText(this.dataService.dav.user.UsedStorage, 1)
			)
			.replace(
				"{1}",
				bytesToGigabytesText(this.dataService.dav.user.TotalStorage, 0)
			)
	}

	navigateToLoginPage() {
		Dav.ShowLoginPage(environment.apiKey, window.location.origin)
	}

	navigateToSignupPage() {
		Dav.ShowSignupPage(environment.apiKey, window.location.origin)
	}
}
