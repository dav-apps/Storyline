import { Component, ViewChild } from "@angular/core"
import {
	faRotate as faRotateLight,
	faBellRing as faBellRingLight,
	faUserPlus as faUserPlusLight,
	faCircleInfo as faCircleInfoLight
} from "@fortawesome/pro-light-svg-icons"
import { Dav } from "dav-js"
import { LogoutDialogComponent } from "src/app/dialogs/logout-dialog/logout-dialog.component"
import { UpgradePlusDialogComponent } from "src/app/dialogs/upgrade-plus-dialog/upgrade-plus-dialog.component"
import { DavApiService } from "src/app/services/dav-api-service"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { bytesToGigabytesText } from "src/app/utils"
import { environment } from "src/environments/environment"

@Component({
	templateUrl: "./user-page.component.html",
	styleUrl: "./user-page.component.scss"
})
export class UserPageComponent {
	locale = this.localizationService.locale.userPage
	actionsLocale = this.localizationService.locale.actions
	faRotateLight = faRotateLight
	faBellRingLight = faBellRingLight
	faUserPlusLight = faUserPlusLight
	faCircleInfoLight = faCircleInfoLight
	@ViewChild("logoutDialog")
	logoutDialog: LogoutDialogComponent
	@ViewChild("upgradePlusDialog")
	upgradePlusDialog: UpgradePlusDialogComponent
	websiteUrl = environment.websiteUrl
	usedStoragePercent: number = 0
	usedStorageText: string = ""
	plusCardLoading: boolean = false

	constructor(
		private davApiService: DavApiService,
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

	showUpgradePlusDialog() {
		this.upgradePlusDialog.show()
	}

	async navigateToCheckoutPage() {
		this.plusCardLoading = true

		let response = await this.davApiService.createSubscriptionCheckoutSession(
			`url`,
			{
				plan: "PLUS",
				successUrl: window.location.origin,
				cancelUrl: window.location.href
			}
		)

		const url = response.data?.createSubscriptionCheckoutSession?.url

		if (url != null) {
			window.location.href = url
		} else {
			this.plusCardLoading = false
		}
	}

	showLogoutDialog() {
		this.logoutDialog.show()
	}

	async logout() {
		this.logoutDialog.hide()

		await this.dataService.dav.Logout()
		window.location.href = "/user"
	}
}
