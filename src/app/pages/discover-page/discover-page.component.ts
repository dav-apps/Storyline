import { Component } from "@angular/core"
import { LocalizationService } from "src/app/services/localization-service"

@Component({
	templateUrl: "./discover-page.component.html",
	styleUrl: "./discover-page.component.scss"
})
export class DiscoverPageComponent {
	locale = this.localizationService.locale.discoverPage

	constructor(private localizationService: LocalizationService) {}
}
