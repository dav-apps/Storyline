import { Component } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import {
	faArrowUpRightFromSquare,
	faPlus
} from "@fortawesome/pro-regular-svg-icons"
import { ApiService } from "../../services/api-service"
import { PublisherResource } from "../../types"

@Component({
	templateUrl: "./publisher-page.component.html",
	styleUrl: "./publisher-page.component.scss"
})
export class PublisherPageComponent {
	publisher: PublisherResource = null
	faArrowUpRightFromSquare = faArrowUpRightFromSquare
	faPlus = faPlus

	constructor(
		private apiService: ApiService,
		private activatedRoute: ActivatedRoute
	) {}

	async ngOnInit() {
		const uuid = this.activatedRoute.snapshot.paramMap.get("uuid")

		const response = await this.apiService.retrievePublisher(
			`
				name
				url
				logoUrl
				articles {
					items {
						title
					}
				}
			`,
			{ uuid }
		)

		const responseData = response.data?.retrievePublisher
		if (responseData == null) return

		this.publisher = responseData
	}

	openWebsite() {
		window.open(this.publisher.url, "_blank")
	}
}
