export interface List<T> {
	total: number
	items: T[]
}

//#region API types
export interface ArticleResource {
	uuid: string
	url: string
	title: string
	description: string
	date: string
	lang: string
	image: string
	text: string
}
//#endregion
