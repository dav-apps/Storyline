import { Component, ViewChild } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { CreateFeedDialogComponent } from "src/app/dialogs/create-feed-dialog/create-feed-dialog.component"
import { ApiService } from "src/app/services/api-service"
import { LocalizationService } from "src/app/services/localization-service"
import { PublisherResource, FeedResource } from "src/app/types"
import * as ErrorCodes from "src/app/errorCodes"

@Component({
	templateUrl: "./admin-publisher-page.component.html",
	styleUrl: "./admin-publisher-page.component.scss"
})
export class AdminPublisherPageComponent {
	locale = this.localizationService.locale.adminPublisherPage
	publisher: PublisherResource = null
	feeds: FeedResource[] = []

	//#region CreateFeedDialog
	@ViewChild("createFeedDialog")
	createFeedDialog: CreateFeedDialogComponent
	createFeedDialogLoading: boolean = false
	createFeedDialogUrlError: string = ""
	//#endregion

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

		for (let feed of publisher.feeds.items) {
			this.feeds.push(feed)
		}
	}

	async loadPublisher(uuid: string) {
		const response = await this.apiService.retrievePublisher(
			`
				uuid
				name
				logoUrl
				feeds {
					total
					items {
						uuid
						url
						name
						description
					}
				}
			`,
			{ uuid }
		)

		const responseData = response.data?.retrievePublisher
		if (responseData == null) return null

		return responseData
	}

	showCreateFeedDialog() {
		this.createFeedDialog.show()
	}

	async createFeed(data: { url: string }) {
		this.createFeedDialogUrlError = ""
		this.createFeedDialogLoading = true

		let response = await this.apiService.createFeed(
			`
				uuid
				url
				name
				description
				language
			`,
			{ publisherUuid: this.publisher.uuid, url: data.url }
		)

		this.createFeedDialogLoading = false

		if (response.errors == null) {
			let responseData = response.data.createFeed

			this.feeds.push(responseData)
			this.createFeedDialog.hide()
		} else {
			let errors = response.errors[0].extensions["errors"] as string[]

			for (let errorCode of errors) {
				switch (errorCode) {
					case ErrorCodes.nameTooShort:
						this.createFeedDialogUrlError =
							this.locale.errors.nameTooShort
						break
					case ErrorCodes.nameTooLong:
						this.createFeedDialogUrlError = this.locale.errors.nameTooLong
						break
					case ErrorCodes.descriptionTooShort:
						this.createFeedDialogUrlError =
							this.locale.errors.descriptionTooShort
						break
					case ErrorCodes.descriptionTooLong:
						this.createFeedDialogUrlError =
							this.locale.errors.descriptionTooLong
						break
					case ErrorCodes.languageInvalid:
						this.createFeedDialogUrlError =
							this.locale.errors.languageInvalid
						break
					default:
						this.createFeedDialogUrlError =
							this.locale.errors.unexpectedError
						break
				}
			}
		}
	}
}
