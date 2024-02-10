import { Component } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import {
	faArrowUpRightFromSquare,
	faPlus
} from "@fortawesome/pro-regular-svg-icons"
import { ApiService } from "../../services/api-service"
import { ArticleResource, PublisherResource } from "../../types"

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
		private router: Router,
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
						uuid
						title
						imageUrl
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

	articleItemClick(event: Event, article: ArticleResource) {
		event.preventDefault()
		this.router.navigate(["article", article.uuid])
	}
}
