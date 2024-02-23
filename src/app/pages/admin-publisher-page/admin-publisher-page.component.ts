import { Component, ViewChild } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { CreatePublisherDialogComponent } from "src/app/dialogs/create-publisher-dialog/create-publisher-dialog.component"
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

	//#region PublisherDialog
	@ViewChild("publisherDialog")
	publisherDialog: CreatePublisherDialogComponent
	publisherDialogLoading: boolean = false
	publisherDialogName: string = ""
	publisherDialogNameError: string = ""
	publisherDialogDescription: string = ""
	publisherDialogDescriptionError: string = ""
	publisherDialogUrl: string = ""
	publisherDialogUrlError: string = ""
	publisherDialogLogoUrl: string = ""
	publisherDialogLogoUrlError: string = ""
	//#endregion

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
				description
				url
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

	showPublisherDialog() {
		this.publisherDialogName = this.publisher.name
		this.publisherDialogDescription = this.publisher.description
		this.publisherDialogUrl = this.publisher.url
		this.publisherDialogLogoUrl = this.publisher.logoUrl
		this.publisherDialog.show()
	}

	showCreateFeedDialog() {
		this.createFeedDialog.show()
	}

	async updatePublisher(data: {
		name: string
		description: string
		url: string
		logoUrl: string
	}) {
		this.publisherDialogNameError = ""
		this.publisherDialogDescriptionError = ""
		this.publisherDialogUrlError = ""
		this.publisherDialogLogoUrlError = ""
		this.publisherDialogLoading = true

		let response = await this.apiService.updatePublisher(
			`
				uuid
				name
				description
				url
				logoUrl
			`,
			{
				uuid: this.publisher.uuid,
				...data
			}
		)

		this.publisherDialogLoading = false

		if (response.errors == null) {
			let responseData = response.data.updatePublisher

			this.publisher = responseData
			this.publisherDialog.hide()
		} else {
			let errors = response.errors[0].extensions["errors"] as string[]

			for (let errorCode of errors) {
				switch (errorCode) {
					case ErrorCodes.nameTooShort:
						if (data.name.length == 0) {
							this.publisherDialogNameError =
								this.locale.errors.nameMissing
						} else {
							this.publisherDialogNameError =
								this.locale.errors.nameTooShort
						}
						break
					case ErrorCodes.nameTooLong:
						this.publisherDialogNameError = this.locale.errors.nameTooLong
						break
					case ErrorCodes.descriptionTooShort:
						if (data.description.length == 0) {
							this.publisherDialogDescriptionError =
								this.locale.errors.descriptionMissing
						} else {
							this.publisherDialogDescriptionError =
								this.locale.errors.descriptionTooShort
						}
						break
					case ErrorCodes.descriptionTooLong:
						this.publisherDialogDescriptionError =
							this.locale.errors.descriptionTooLong
						break
					case ErrorCodes.urlInvalid:
						if (data.url.length == 0) {
							this.publisherDialogUrlError =
								this.locale.errors.urlMissing
						} else {
							this.publisherDialogUrlError =
								this.locale.errors.urlInvalid
						}
						break
					case ErrorCodes.logoUrlInvalid:
						if (data.logoUrl.length == 0) {
							this.publisherDialogLogoUrlError =
								this.locale.errors.logoUrlMissing
						} else {
							this.publisherDialogLogoUrlError =
								this.locale.errors.logoUrlInvalid
						}
						break
					default:
						this.publisherDialogNameError =
							this.locale.errors.unexpectedError
						break
				}
			}
		}
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
