import {
	Component,
	ViewChild,
	ElementRef,
	Input,
	Output,
	EventEmitter,
	Inject,
	PLATFORM_ID
} from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { Dialog } from "dav-ui-components"
import { LocalizationService } from "src/app/services/localization-service"
import { FeedResource, PublisherResource } from "src/app/types"

@Component({
	selector: "storyline-feed-settings-dialog",
	templateUrl: "./feed-settings-dialog.component.html",
	styleUrl: "./feed-settings-dialog.component.scss"
})
export class FeedSettingsDialogComponent {
	locale = this.localizationService.locale.dialogs.feedSettingsDialog
	actionsLocale = this.localizationService.locale.actions
	@Input() publishers: PublisherResource[] = []
	@Input() excludedFeeds: { [uuid: string]: string[] } = {}
	@Output() unfollowPublisher = new EventEmitter()
	@Output() includeFeed = new EventEmitter()
	@Output() excludeFeed = new EventEmitter()
	@Output() closed = new EventEmitter()
	@ViewChild("dialog")
	dialog: ElementRef<Dialog>
	visible: boolean = false

	constructor(
		private localizationService: LocalizationService,
		@Inject(PLATFORM_ID) private platformId: object
	) {}

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			document.body.appendChild(this.dialog.nativeElement)
		}
	}

	ngOnDestroy() {
		if (isPlatformBrowser(this.platformId)) {
			document.body.removeChild(this.dialog.nativeElement)
		}
	}

	show() {
		this.visible = true
	}

	hide() {
		this.visible = false
		this.closed.emit()
	}

	feedCheckboxChange(
		event: Event,
		publisher: PublisherResource,
		feed: FeedResource
	) {
		let checked = (event as CustomEvent).detail.checked

		if (checked) {
			this.includeFeed.emit({
				publisher,
				feed
			})
		} else {
			this.excludeFeed.emit({
				publisher,
				feed
			})
		}
	}
}
