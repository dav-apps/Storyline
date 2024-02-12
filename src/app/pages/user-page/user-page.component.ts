import { Component } from "@angular/core"
import {
	faRotate as faRotateLight,
	faPlus as faPlusLight,
	faGem as faGemLight
} from "@fortawesome/pro-light-svg-icons"
import { Dav } from "dav-js"
import { LocalizationService } from "../../services/localization-service"
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
	websiteUrl = environment.websiteBaseUrl

	constructor(private localizationService: LocalizationService) {}

	navigateToLoginPage() {
		Dav.ShowLoginPage(environment.apiKey, window.location.origin)
	}

	navigateToSignupPage() {
		Dav.ShowSignupPage(environment.apiKey, window.location.origin)
	}
}
