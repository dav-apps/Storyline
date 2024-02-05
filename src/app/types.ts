export interface List<T> {
	total: number
	items: T[]
}

//#region API types
export interface PublisherResource {
	uuid: string
	name: string
	url: string
}

export interface ArticleResource {
	uuid: string
	publisher: PublisherResource
	url: string
	title: string
	description: string
	date: string
	lang: string
	image: string
	text: string
}
//#endregion
