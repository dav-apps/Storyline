import { Component, ViewChild, ElementRef, Input } from "@angular/core"
import { Dialog } from "dav-ui-components"
import { LocalizationService } from "src/app/services/localization-service"
import { PublisherResource } from "src/app/types"

@Component({
	selector: "storyline-feed-settings-dialog",
	templateUrl: "./feed-settings-dialog.component.html",
	styleUrl: "./feed-settings-dialog.component.scss"
})
export class FeedSettingsDialogComponent {
	locale = this.localizationService.locale.dialogs.feedSettingsDialog
	actionsLocale = this.localizationService.locale.actions
	@Input() publishers: PublisherResource[] = []
	@ViewChild("dialog") dialog: ElementRef<Dialog>
	visible: boolean = false

	constructor(private localizationService: LocalizationService) {}

	ngAfterViewInit() {
		document.body.appendChild(this.dialog.nativeElement)
	}

	ngOnDestroy() {
		document.body.removeChild(this.dialog.nativeElement)
	}

	show() {
		this.visible = true
	}

	hide() {
		this.visible = false
	}
}
