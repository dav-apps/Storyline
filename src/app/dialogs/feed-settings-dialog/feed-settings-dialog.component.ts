import {
	Component,
	ViewChild,
	ElementRef,
	Input,
	Output,
	EventEmitter
} from "@angular/core"
import { Dialog } from "dav-ui-components"
import { LocalizationService } from "src/app/services/localization-service"
import { isClient } from "src/app/utils"
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

	constructor(private localizationService: LocalizationService) {}

	ngAfterViewInit() {
		if (isClient()) {
			document.body.appendChild(this.dialog.nativeElement)
		}
	}

	ngOnDestroy() {
		if (isClient()) {
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
