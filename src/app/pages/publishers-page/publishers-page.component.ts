import { Component } from "@angular/core"
import { ApiService } from "src/app/services/api-service"
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
		private localizationService: LocalizationService
	) {}

	async ngOnInit() {
		let response = await this.apiService.listPublishers(
			`
				items {
					uuid
					name
					articles {
						items {
							uuid
							title
							imageUrl
						}
					}
				}
			`
		)

		if (response.errors == null) {
			for (let publisher of response.data.listPublishers.items) {
				this.publishers.push(publisher)
			}
		}
	}
}
