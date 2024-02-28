import {
	Component,
	Input,
	Output,
	ViewChild,
	ElementRef,
	EventEmitter
} from "@angular/core"
import { Dialog } from "dav-ui-components"
import { LocalizationService } from "src/app/services/localization-service"

@Component({
	selector: "storyline-upgrade-plus-dialog",
	templateUrl: "./upgrade-plus-dialog.component.html",
	styleUrl: "./upgrade-plus-dialog.component.scss"
})
export class UpgradePlusDialogComponent {
	locale = this.localizationService.locale.dialogs.upgradePlusDialog
	actionsLocale = this.localizationService.locale.actions
	@Input() loading: boolean = false
	@Output() primaryButtonClick = new EventEmitter()
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
