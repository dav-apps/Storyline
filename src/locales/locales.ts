//#region en
const enDefaults = {
	startPage: {
		youFollow: "You follow",
		activateNotificationsCard: {
			headline: "Activate notifications",
			subhead:
				"Allow notifications to stay up to date with the latest events on this device as well!",
			successMessage: "Notifications have been successfully activated",
			failureMessage: "There was a problem activating notifications"
		}
	},
	discoverPage: {
		publishersInTheSpotlight: "Publishers in the spotlight",
		latestNews: "Latest news"
	},
	publishersPage: {
		title: "All publishers"
	},
	bookmarksPage: {
		title: "Your bookmarks",
		noArticles: "You have no saved articles"
	},
	adminPage: {
		publishers: "Publishers"
	},
	adminPublisherPage: {
		edit: "Edit"
	},
	userPage: {
		title: "Your account",
		headline: "Save your data and get access to advanced features",
		benefit1: "Access your news feed on all your devices",
		benefit2: "Follow as many providers as you like",
		benefit3: "Enable optional notifications for new articles",
		login: "Log in",
		logout: "Log out",
		signup: "Sign up",
		planFree: "Free",
		planPlus: "Plus",
		planPro: "Pro",
		storageUsed: "{0} GB of {1} GB used",
		upgradePlusCard: {
			headline: "Storyline Plus",
			subhead: "3 € per month",
			benefit1: "📄 Smart Article Summaries",
			benefit2: "⏳ Real-time Updates",
			benefit3: "🎯 Enhanced Feed Personalization"
		}
	},
	settingsPage: {
		title: "Settings",
		theme: "App theme",
		lightTheme: "Light",
		darkTheme: "Dark",
		systemTheme: "System default",
		suggestProvider: "Send suggestions for providers",
		suggestProviderLink:
			"https://docs.google.com/forms/d/e/1FAIpQLSdlpLbkqIMiIx9wN5vsQ9MFu42fWtufYV_5Mh5-TFcpcoO26g/viewform?usp=sf_link",
		github: "Storyline on GitHub",
		privacy: "Privacy Policy",
		updateSearch: "Searching for updates...",
		installingUpdate: "Installing the update...",
		updateError: "Error while installing the update",
		noUpdateAvailable: "The app is up-to-date",
		activateUpdate: "Activate update"
	},
	articlePage: {
		openArticle: "Open original article",
		articleRecommendationsHeadline: {
			byPublisher: "More articles by {0}",
			inFeed: "More articles in the category {0}"
		},
		upgradeCardHeadline: "Too lazy to read the whole article?",
		upgradeCardSubhead: "Get article summaries with Storyline Plus.",
		learnMore: "Learn more",
		addedToBookmarks: "Article was added to bookmarks",
		removedFromBookmarks: "Article was removed from bookmarks"
	},
	publisherPage: {},
	dialogs: {
		loginPromptDialog: {
			headline: "Log in",
			intro: "Log in to enjoy the following additional features:",
			followingPublishers:
				"📰 <strong>Limitless Publisher Follows</strong>: Follow as many publishers as you desire, customizing your content stream to match your interests and preferences.",
			notifications:
				"🔔 <strong>Real-time Notifications</strong>: Stay informed with our timely alerts! Receive notifications for new articles, ensuring you never miss out on the latest updates and insights."
		},
		logoutDialog: {
			headline: "Log out",
			description: "Are you sure you want to log out?"
		},
		upgradePlusDialog: {
			headline: "Storyline Plus",
			intro: "For just 3 € per month, elevate your news-reading experience with exclusive benefits that keep you ahead of the curve!",
			articleSummaries:
				"📄 <strong>Smart Article Summaries</strong>: Effortlessly grasp the essence of each article with concise summaries, saving you valuable time and ensuring you stay informed efficiently.",
			realTimeUpdates:
				"⏳ <strong>Real-time Updates</strong>: Stay on the pulse of the latest news as it happens, ensuring that you are always informed and up-to-date with the latest developments.",
			feedCustomization:
				"🎯 <strong>Enhanced Feed Personalization</strong>: Take control of your content by customizing your feed based on your unique interests. Fine-tune preferences for each publisher, enabling you to filter out articles that don't align with your specific interests."
		},
		publisherDialog: {
			headline: {
				create: "Create publisher",
				update: "Update publisher"
			},
			nameTextfieldLabel: "Name",
			descriptionTextareaLabel: "Description",
			urlTextfieldLabel: "URL",
			logoUrlTextfieldLabel: "Logo URL"
		},
		createFeedDialog: {
			headline: "Create feed",
			urlTextfieldLabel: "URL"
		},
		feedSettingsDialog: {
			headline: "Personalize your feed"
		}
	},
	actions: {
		follow: "Follow",
		unfollow: "Unfollow",
		login: "Log in",
		logout: "Log out",
		create: "Create",
		save: "Save",
		activate: "Activate",
		getStarted: "Get started",
		cancel: "Cancel",
		close: "Close"
	},
	errors: {
		nameMissing: "Please enter a name",
		nameTooShort: "The name is too short",
		nameTooLong: "The name is too long",
		descriptionMissing: "Please enter a description",
		descriptionTooShort: "The description is too short",
		descriptionTooLong: "The description is too long",
		urlMissing: "Please enter a URL",
		urlInvalid: "The URL is invalid",
		logoUrlMissing: "Please enter a logo URL",
		logoUrlInvalid: "The logo URL is invalid",
		languageInvalid: "The language is invalid",
		unexpectedError: "An unexpected error occured. Please try it again later."
	},
	misc: {
		newsFeed: "News feed",
		discover: "Discover"
	}
}

export var enUS = enDefaults
export var enGB = enDefaults
//#endregion

//#region de
const deDefaults = {
	startPage: {
		youFollow: "Du folgst",
		activateNotificationsCard: {
			headline: "Benachrichtigungen aktivieren",
			subhead:
				"Erlaube Benachrichtigungen, um auch auf diesem Gerät immer auf dem neuesten Stand der Ereignisse zu sein!",
			successMessage: "Benachrichtigungen wurden erfolgreich aktiviert",
			failureMessage:
				"Es gab ein Problem beim Aktivieren von Benachrichtigungen"
		}
	},
	discoverPage: {
		publishersInTheSpotlight: "Anbieter im Rampenlicht",
		latestNews: "Neueste Meldungen"
	},
	publishersPage: {
		title: "Alle Anbieter"
	},
	bookmarksPage: {
		title: "Deine Lesezeichen",
		noArticles: "Du hast keine gespeicherten Artikel"
	},
	adminPage: {
		publishers: "Anbieter"
	},
	adminPublisherPage: {
		edit: "Bearbeiten"
	},
	userPage: {
		title: "Dein Account",
		headline:
			"Sichere deine Daten und erhalte Zugriff auf erweiterte Funktionen",
		benefit1: "Lese deinen News-Feed auf all deinen Geräten",
		benefit2: "Folge beliebig vielen Anbietern",
		benefit3: "Schalte optionale Benachrichtigungen für neue Artikel frei",
		login: "Anmelden",
		logout: "Abmelden",
		signup: "Registrieren",
		planFree: "Free",
		planPlus: "Plus",
		planPro: "Pro",
		storageUsed: "{0} GB von {1} GB verwendet",
		upgradePlusCard: {
			headline: "Storyline Plus",
			subhead: "3 € pro Monat",
			benefit1: "📄 Prägnante Artikelzusammenfassungen",
			benefit2: "⏳ Echtzeit-Updates",
			benefit3: "🎯 Optimierte Personalisierung deines Feeds"
		}
	},
	settingsPage: {
		title: "Einstellungen",
		theme: "App-Design",
		lightTheme: "Hell",
		darkTheme: "Dunkel",
		systemTheme: "System-Standard",
		suggestProvider: "Vorschläge für Anbieter senden",
		suggestProviderLink:
			"https://docs.google.com/forms/d/e/1FAIpQLSfT3tKCHY_EkEqV5LBIVywPTm8j0jNSK-YFEMGv-LPe3QCbIA/viewform?usp=sf_link",
		github: "Storyline auf GitHub",
		privacy: "Datenschutzerklärung",
		updateSearch: "Suche nach Updates...",
		installingUpdate: "Update wird installiert...",
		updateError: "Fehler beim Installieren des Updates",
		noUpdateAvailable: "Die App ist aktuell",
		activateUpdate: "Update aktivieren"
	},
	articlePage: {
		openArticle: "Zum Originalartikel",
		articleRecommendationsHeadline: {
			byPublisher: "Weitere Artikel von {0}",
			inFeed: "Weitere Artikel aus der Rubrik {0}"
		},
		upgradeCardHeadline: "Zu faul, den kompletten Artikel zu lesen?",
		upgradeCardSubhead:
			"Erhalte Artikel-Zusammenfassungen mit Storyline Plus.",
		learnMore: "Mehr erfahren",
		addedToBookmarks: "Artikel wurde in Lesezeichen gespeichert",
		removedFromBookmarks: "Artikel wurde von Lesezeichen entfernt"
	},
	publisherPage: {},
	dialogs: {
		loginPromptDialog: {
			headline: "Anmelden",
			intro: "Melde dich an, um die folgenden zusätzlichen Funktionen zu genießen:",
			followingPublishers:
				"📰 <strong>Unbegrenztes Folgen von Anbietern</strong>: Folge beliebig vielen Anbietern und passe deinen News-Feed an deine Interessen und Vorlieben an.",
			notifications:
				"🔔 <strong>Echtzeit-Benachrichtigungen</strong>: Bleibe informiert mit unseren zeitnahen Benachrichtigungen! Erhalte umgehend Meldungen zu neuen Artikeln und verpasse so nie die neuesten Updates und Einsichten."
		},
		logoutDialog: {
			headline: "Abmelden",
			description: "Bist du dir sicher, dass du dich abmelden möchtest?"
		},
		upgradePlusDialog: {
			headline: "Storyline Plus",
			intro: "Exklusive Vorteile, um dich immer auf dem Laufen zu halten, für nur 3 € pro Monat!",
			articleSummaries:
				"📄 <strong>Prägnante Artikelzusammenfassungen</strong>: Leicht verständliche Zusammenfassungen ermöglichen es dir spielend, die Essenz eines jeden Artikels zu erfassen. Das spart wertvolle Zeit und stellt sicher, dass du effizient auf dem Laufenden bleibst.",
			realTimeUpdates:
				"⏳ <strong>Echtzeit-Updates</strong>: Sei immer am Puls der neuesten Ereignisse und bleibe so stets informiert über die aktuellen Entwicklungen.",
			feedCustomization:
				"🎯 <strong>Optimierte Personalisierung deines Feeds</strong>: Gestalte deine Inhalte nach deinen individuellen Interessen, indem du deinen Feed anpasst. Feinjustiere deine Vorlieben für jeden Anbieter, um Artikel auszusortieren, die nicht mit deinen spezifischen Interessen übereinstimmen."
		},
		publisherDialog: {
			headline: {
				create: "Anbieter erstellen",
				update: "Anbieter bearbeiten"
			},
			nameTextfieldLabel: "Name",
			descriptionTextareaLabel: "Beschreibung",
			urlTextfieldLabel: "URL",
			logoUrlTextfieldLabel: "Logo-URL"
		},
		createFeedDialog: {
			headline: "Feed erstellen",
			urlTextfieldLabel: "URL"
		},
		feedSettingsDialog: {
			headline: "Personalisiere deinen Feed"
		}
	},
	actions: {
		follow: "Folgen",
		unfollow: "Entfolgen",
		login: "Anmelden",
		logout: "Abmelden",
		create: "Erstellen",
		save: "Speichern",
		activate: "Aktivieren",
		getStarted: "Jetzt loslegen",
		cancel: "Abbrechen",
		close: "Schließen"
	},
	errors: {
		nameMissing: "Bitte gib einen Namen ein",
		nameTooShort: "Der Name ist zu kurz",
		nameTooLong: "Der Name ist zu lang",
		descriptionMissing: "Bitte gib eine Beschreibung ein",
		descriptionTooShort: "Die Beschreibung ist zu kurz",
		descriptionTooLong: "Die Beschreibung ist zu lang",
		urlMissing: "Bitte gib eine URL ein",
		urlInvalid: "Die URL ist ungültig",
		logoUrlMissing: "Bitte gib eine Logo-URL ein",
		logoUrlInvalid: "Die Logo-URL ist ungültig",
		languageInvalid: "Die Sprache ist ungültig",
		unexpectedError:
			"Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später nochmal."
	},
	misc: {
		newsFeed: "News-Feed",
		discover: "Entdecken"
	}
}

export var deDE = deDefaults
export var deAT = deDefaults
export var deCH = deDefaults
//#endregion
