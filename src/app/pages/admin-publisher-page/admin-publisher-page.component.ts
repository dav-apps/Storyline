import { Component } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { ApiService } from "src/app/services/api-service"
import { LocalizationService } from "src/app/services/localization-service"
import { PublisherResource } from "src/app/types"

@Component({
	templateUrl: "./admin-publisher-page.component.html",
	styleUrl: "./admin-publisher-page.component.scss"
})
export class AdminPublisherPageComponent {
	locale = this.localizationService.locale.adminPublisherPage
	publisher: PublisherResource = null

	constructor(
		private apiService: ApiService,
		private localizationService: LocalizationService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	async ngOnInit() {
		const uuid = this.activatedRoute.snapshot.paramMap.get("uuid")
		const publisher = await this.loadPublisher(uuid)

		if (publisher == null) {
			this.router.navigate(["admin"])
			return
		}

		this.publisher = publisher
	}

	async loadPublisher(uuid: string) {
		const response = await this.apiService.retrievePublisher(
			`
				uuid
				name
				logoUrl
			`,
			{ uuid }
		)

		const responseData = response.data?.retrievePublisher
		if (responseData == null) return null

		return responseData
	}
}
