import { Component, ViewChild } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { PublisherDialogComponent } from "src/app/dialogs/publisher-dialog/publisher-dialog.component"
import { CreateFeedDialogComponent } from "src/app/dialogs/create-feed-dialog/create-feed-dialog.component"
import { ApiService } from "src/app/services/api-service"
import { DataService } from "src/app/services/data-service"
import { LocalizationService } from "src/app/services/localization-service"
import { PublisherResource, FeedResource } from "src/app/types"
import * as ErrorCodes from "src/app/errorCodes"

@Component({
	templateUrl: "./admin-publisher-page.component.html",
	styleUrl: "./admin-publisher-page.component.scss"
})
export class AdminPublisherPageComponent {
	locale = this.localizationService.locale.adminPublisherPage
	errorsLocale = this.localizationService.locale.errors
	publisher: PublisherResource = null
	feeds: FeedResource[] = []

	//#region PublisherDialog
	@ViewChild("publisherDialog")
	publisherDialog: PublisherDialogComponent
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
		private dataService: DataService,
		private localizationService: LocalizationService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	async ngOnInit() {
		const slug = this.activatedRoute.snapshot.paramMap.get("slug")
		const publisher = await this.loadPublisher(slug)

		if (publisher == null) {
			this.router.navigate(["admin"])
			return
		}

		this.publisher = publisher

		for (let feed of publisher.feeds.items) {
			this.feeds.push(feed)
		}

		this.dataService.setMeta({ url: `admin/publisher/${slug}` })
	}

	async loadPublisher(slug: string) {
		const response = await this.apiService.retrievePublisher(
			`
				uuid
				slug
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
					}
				}
			`,
			{ uuid: slug }
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
								this.errorsLocale.nameMissing
						} else {
							this.publisherDialogNameError =
								this.errorsLocale.nameTooShort
						}
						break
					case ErrorCodes.nameTooLong:
						this.publisherDialogNameError = this.errorsLocale.nameTooLong
						break
					case ErrorCodes.descriptionTooShort:
						if (data.description.length == 0) {
							this.publisherDialogDescriptionError =
								this.errorsLocale.descriptionMissing
						} else {
							this.publisherDialogDescriptionError =
								this.errorsLocale.descriptionTooShort
						}
						break
					case ErrorCodes.descriptionTooLong:
						this.publisherDialogDescriptionError =
							this.errorsLocale.descriptionTooLong
						break
					case ErrorCodes.urlInvalid:
						if (data.url.length == 0) {
							this.publisherDialogUrlError = this.errorsLocale.urlMissing
						} else {
							this.publisherDialogUrlError = this.errorsLocale.urlInvalid
						}
						break
					case ErrorCodes.logoUrlInvalid:
						if (data.logoUrl.length == 0) {
							this.publisherDialogLogoUrlError =
								this.errorsLocale.logoUrlMissing
						} else {
							this.publisherDialogLogoUrlError =
								this.errorsLocale.logoUrlInvalid
						}
						break
					default:
						this.publisherDialogNameError =
							this.errorsLocale.unexpectedError
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
						this.createFeedDialogUrlError = this.errorsLocale.nameTooShort
						break
					case ErrorCodes.nameTooLong:
						this.createFeedDialogUrlError = this.errorsLocale.nameTooLong
						break
					case ErrorCodes.descriptionTooShort:
						this.createFeedDialogUrlError =
							this.errorsLocale.descriptionTooShort
						break
					case ErrorCodes.descriptionTooLong:
						this.createFeedDialogUrlError =
							this.errorsLocale.descriptionTooLong
						break
					case ErrorCodes.languageInvalid:
						this.createFeedDialogUrlError =
							this.errorsLocale.languageInvalid
						break
					default:
						this.createFeedDialogUrlError =
							this.errorsLocale.unexpectedError
						break
				}
			}
		}
	}
}
