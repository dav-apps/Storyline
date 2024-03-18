import { Component } from "@angular/core"
import { ApiService } from "src/app/services/api-service"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { PublisherResource } from "src/app/types"

@Component({
	templateUrl: "./publishers-page.component.html",
	styleUrl: "./publishers-page.component.scss"
})
export class PublishersPageComponent {
	locale = this.localizationService.locale.publishersPage
	publishers: PublisherResource[] = []

	constructor(
		private apiService: ApiService,
		private dataService: DataService,
		private localizationService: LocalizationService
	) {}

	async ngOnInit() {
		this.dataService.loadingScreenVisible = true

		let response = await this.apiService.listPublishers(
			`
				items {
					uuid
					name
					logoUrl
					articles {
						items {
							uuid
							slug
							title
							imageUrl
						}
					}
				}
			`,
			{
				languages: this.dataService.getLanguages()
			}
		)

		if (response.errors == null) {
			for (let publisher of response.data.listPublishers.items) {
				this.publishers.push(publisher)
			}
		}

		this.dataService.loadingScreenVisible = false
	}
}
