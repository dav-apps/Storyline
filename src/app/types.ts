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
	slug: string
	name: string
	description: string
	url: string
	logoUrl: string
	feeds: List<FeedResource>
	articles: List<ArticleResource>
}

export interface FeedResource {
	uuid: string
	url: string
	name: string
	language: string
	articles: List<ArticleResource>
}

export interface ArticleResource {
	uuid: string
	publisher: PublisherResource
	slug: string
	url: string
	title: string
	description: string
	date: string
	imageUrl: string
	content: string
	summary: string
	feeds: List<FeedResource>
}
//#endregion

//#region dav API types
export interface CheckoutSession {
	url: string
}

export type Plan = "FREE" | "PLUS" | "PRO"
//#endregion
