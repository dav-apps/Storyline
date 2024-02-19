import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { ApiService } from "src/app/services/api-service"
import { LocalizationService } from "src/app/services/localization-service"
import { PublisherResource } from "src/app/types"

@Component({
	templateUrl: "./admin-page.component.html",
	styleUrl: "./admin-page.component.scss"
})
export class AdminPageComponent {
	locale = this.localizationService.locale.adminPage
	publishers: PublisherResource[] = []
	limit: number = 10
	offset: number = 0

	constructor(
		private apiService: ApiService,
		private localizationService: LocalizationService,
		private router: Router
	) {}

	async ngOnInit() {
		await this.loadPublishers()
	}

	async loadPublishers() {
		let listPublishersResponse = await this.apiService.listPublishers(
			`
				total
				items {
					uuid
					name
					logoUrl
				}
			`,
			{
				limit: this.limit,
				offset: this.offset
			}
		)

		let listPublishersResponseData =
			listPublishersResponse.data?.listPublishers

		if (listPublishersResponseData != null) {
			for (let item of listPublishersResponseData.items) {
				this.publishers.push(item)
			}
		}
	}

	navigateToAdminPublisherPage(publisher: PublisherResource) {
		this.router.navigate(["admin", "publisher", publisher.uuid])
	}
}
