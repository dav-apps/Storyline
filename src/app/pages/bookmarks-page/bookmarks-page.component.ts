import { Component } from "@angular/core"
import { GetAllTableObjects } from "dav-js"
import { ApiService } from "src/app/services/api-service"
import { LocalizationService } from "src/app/services/localization-service"
import { ArticleResource } from "src/app/types"
import { bookmarkTableArticleKey } from "src/app/constants"
import { environment } from "src/environments/environment"

@Component({
	templateUrl: "./bookmarks-page.component.html",
	styleUrl: "./bookmarks-page.component.scss"
})
export class BookmarksPageComponent {
	locale = this.localizationService.locale.bookmarksPage
	loading: boolean = true
	articles: ArticleResource[] = []

	constructor(
		private apiService: ApiService,
		private localizationService: LocalizationService
	) {}

	async ngOnInit() {
		const tableObjects = await GetAllTableObjects(environment.bookmarkTableId)

		for (let tableObject of tableObjects) {
			const articleUuid = tableObject.GetPropertyValue(
				bookmarkTableArticleKey
			) as string

			const response = await this.apiService.retrieveArticle(
				`
					uuid
					slug
					title
					imageUrl
					publisher {
						name
						logoUrl
					}
				`,
				{ uuid: articleUuid }
			)

			const responseData = response.data?.retrieveArticle

			if (responseData != null) {
				this.articles.push(responseData)
			}
		}

		this.loading = false
	}
}
