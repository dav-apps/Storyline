import { Component, Input } from "@angular/core"
import { Router } from "@angular/router"
import { ApiService } from "src/app/services/api-service"
import { PublisherResource } from "src/app/types"

@Component({
	selector: "storyline-horizontal-publisher-list",
	templateUrl: "./horizontal-publisher-list.component.html",
	styleUrl: "./horizontal-publisher-list.component.scss"
})
export class HorizontalPublisherListComponent {
	@Input() headline: string = ""
	@Input() maxItems: number = 4
	@Input() publisherUuids: string[] = []
	publishers: PublisherResource[] = []
	loading: boolean = true

	constructor(private apiService: ApiService, private router: Router) {}

	async ngOnInit() {
		if (this.publisherUuids.length > 0) {
			await this.loadPublishersFromUuids()
		} else {
			await this.loadPublishers()
		}
	}

	async loadPublishers() {
		let response = await this.apiService.listPublishers(
			`
				items {
					uuid
					name
					logoUrl
				}
			`,
			{ random: true, limit: this.maxItems }
		)
		let responseData = response.data.listPublishers
		if (responseData == null) return

		this.publishers = responseData.items
		this.loading = false
	}

	async loadPublishersFromUuids() {
		for (let uuid of this.publisherUuids) {
			let response = await this.apiService.retrievePublisher(
				`
					uuid
					name
					logoUrl
				`,
				{ uuid }
			)
			let responseData = response.data.retrievePublisher

			if (responseData != null) {
				this.publishers.push(responseData)
			}
		}

		this.loading = false
	}

	navigateToPublisherPage(event: Event, publisher: PublisherResource) {
		event.preventDefault()
		this.router.navigate(["publisher", publisher.uuid])
	}
}
