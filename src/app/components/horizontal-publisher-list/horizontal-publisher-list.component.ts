import { Component, EventEmitter, Input, Output } from "@angular/core"
import { Router } from "@angular/router"
import {
	faArrowRight as faArrowRightLight,
	faSliders as faSlidersLight
} from "@fortawesome/pro-light-svg-icons"
import { ApiService } from "src/app/services/api-service"
import { DataService } from "src/app/services/data-service"
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
	@Input() showMoreButton: boolean = false
	@Input() showSettingsButton: boolean = false
	@Output() settingsButtonClick = new EventEmitter()
	faArrowRightLight = faArrowRightLight
	faSlidersLight = faSlidersLight
	publishers: PublisherResource[] = []
	loading: boolean = true

	constructor(
		private apiService: ApiService,
		private dataService: DataService,
		private router: Router
	) {}

	ngOnInit() {
		this.init()
	}

	async init() {
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
					slug
					name
					logoUrl
				}
			`,
			{
				random: true,
				languages: this.dataService.getLanguages(),
				limit: this.maxItems
			}
		)
		let responseData = response.data.listPublishers
		if (responseData == null) return

		this.publishers = responseData.items
		this.loading = false
	}

	async loadPublishersFromUuids() {
		this.publishers = []

		for (let uuid of this.publisherUuids) {
			let response = await this.apiService.retrievePublisher(
				`
					uuid
					slug
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
		this.router.navigate(["publisher", publisher.slug])
	}

	moreButtonClick(event: MouseEvent) {
		event.preventDefault()
		this.dataService.contentContainer.scrollTo(0, 0)
		this.router.navigate(["publishers"])
	}
}
