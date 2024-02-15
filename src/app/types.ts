export interface List<T> {
	total: number
	items: T[]
}

export enum Theme {
	System,
	Light,
	Dark
}

//#region API types
export interface PublisherResource {
	uuid: string
	name: string
	url: string
	logoUrl: string
	copyright: string
	articles: List<ArticleResource>
}

export interface ArticleResource {
	uuid: string
	publisher: PublisherResource
	url: string
	title: string
	description: string
	date: string
	imageUrl: string
	content: string
}
//#endregion
