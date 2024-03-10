import { Injectable } from "@angular/core"
import { Apollo, ApolloBase, MutationResult, gql } from "apollo-angular"
import { ApolloQueryResult, ErrorPolicy } from "@apollo/client/core"
import { renewSession } from "dav-js"
import {
	List,
	PublisherResource,
	FeedResource,
	ArticleResource
} from "../types"
import * as ErrorCodes from "../errorCodes"
import { storylineApiClientName } from "../constants"

const errorPolicy: ErrorPolicy = "all"

@Injectable()
export class ApiService {
	private apollo: ApolloBase

	constructor(private apolloProvider: Apollo) {
		this.loadApolloClient()
	}

	loadApolloClient() {
		this.apollo = this.apolloProvider.use(storylineApiClientName)
	}

	//#region Publisher
	async createPublisher(
		queryData: string,
		variables: {
			name: string
			description: string
			url: string
			logoUrl: string
		}
	): Promise<MutationResult<{ createPublisher: PublisherResource }>> {
		let result = await this.apollo
			.mutate<{
				createPublisher: PublisherResource
			}>({
				mutation: gql`
					mutation CreatePublisher(
						$name: String!
						$description: String!
						$url: String!
						$logoUrl: String!
					) {
						createPublisher(
							name: $name
							description: $description
							url: $url
							logoUrl: $logoUrl
						) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()

		if (
			result.errors != null &&
			result.errors.length > 0 &&
			result.errors[0].extensions["code"] == ErrorCodes.sessionEnded
		) {
			// Renew the access token and run the query again
			await renewSession()

			return await this.createPublisher(queryData, variables)
		}

		return result
	}

	async updatePublisher(
		queryData: string,
		variables: {
			uuid: string
			name?: string
			description?: string
			url?: string
			logo?: string
		}
	): Promise<MutationResult<{ updatePublisher: PublisherResource }>> {
		let result = await this.apollo
			.mutate<{
				updatePublisher: PublisherResource
			}>({
				mutation: gql`
					mutation UpdatePublisher(
						$uuid: String!
						$name: String
						$description: String
						$url: String
						$logoUrl: String
					) {
						updatePublisher(
							uuid: $uuid
							name: $name
							description: $description
							url: $url
							logoUrl: $logoUrl
						) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()

		if (
			result.errors != null &&
			result.errors.length > 0 &&
			result.errors[0].extensions["code"] == ErrorCodes.sessionEnded
		) {
			// Renew the access token and run the query again
			await renewSession()

			return await this.updatePublisher(queryData, variables)
		}

		return result
	}

	async retrievePublisher(
		queryData: string,
		variables: {
			uuid: string
			hasName?: boolean
			limit?: number
			offset?: number
		}
	): Promise<ApolloQueryResult<{ retrievePublisher: PublisherResource }>> {
		let hasNameParam = queryData.includes("hasName")
			? "$hasName: Boolean"
			: ""
		let limitParam = queryData.includes("limit") ? "$limit: Int" : ""
		let offsetParam = queryData.includes("offset") ? "$offset: Int" : ""

		return await this.apollo
			.query<{
				retrievePublisher: PublisherResource
			}>({
				query: gql`
					query RetrievePublisher(
						$uuid: String!
						${hasNameParam}
						${limitParam}
						${offsetParam}
					) {
						retrievePublisher(uuid: $uuid) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()
	}

	async listPublishers(
		queryData: string,
		variables?: { random?: boolean; limit?: number; offset?: number }
	): Promise<ApolloQueryResult<{ listPublishers: List<PublisherResource> }>> {
		return await this.apollo
			.query<{
				listPublishers: List<PublisherResource>
			}>({
				query: gql`
					query ListPublishers(
						$random: Boolean
						$limit: Int
						$offset: Int
					) {
						listPublishers(
							random: $random
							limit: $limit
							offset: $offset
						) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()
	}
	//#endregion

	//#region Feed
	async createFeed(
		queryData: string,
		variables: { publisherUuid: string; url: string }
	): Promise<MutationResult<{ createFeed: FeedResource }>> {
		let result = await this.apollo
			.mutate<{ createFeed: FeedResource }>({
				mutation: gql`
					mutation CreateFeed(
						$publisherUuid: String!
						$url: String!
					) {
						createFeed(
							publisherUuid: $publisherUuid
							url: $url
						) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()

		if (
			result.errors != null &&
			result.errors.length > 0 &&
			result.errors[0].extensions["code"] == ErrorCodes.sessionEnded
		) {
			// Renew the access token and run the query again
			await renewSession()

			return await this.createFeed(queryData, variables)
		}

		return result
	}

	async retrieveFeed(
		queryData: string,
		variables: {
			uuid: string
			exclude?: string
			limit?: number
			offset?: number
		}
	): Promise<ApolloQueryResult<{ retrieveFeed: FeedResource }>> {
		let excludeParam = queryData.includes("exclude") ? "$exclude: String" : ""
		let limitParam = queryData.includes("limit") ? "$limit: Int" : ""
		let offsetParam = queryData.includes("offset") ? "$offset: Int" : ""

		return await this.apollo
			.query<{ retrieveFeed: FeedResource }>({
				query: gql`
					query RetrieveFeed(
						$uuid: String!
						${excludeParam}
						${limitParam}
						${offsetParam}
					) {
						retrieveFeed(uuid: $uuid) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()
	}
	//#endregion

	//#region Article
	async retrieveArticle(
		queryData: string,
		variables: { uuid: string }
	): Promise<ApolloQueryResult<{ retrieveArticle: ArticleResource }>> {
		return await this.apollo
			.query<{
				retrieveArticle: ArticleResource
			}>({
				query: gql`
					query RetrieveArticle($uuid: String!) {
						retrieveArticle(uuid: $uuid) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()
	}

	async listArticles(
		queryData: string,
		variables: {
			publishers?: string[]
			excludeFeeds?: string[]
			limit?: number
			offset?: number
		}
	): Promise<
		ApolloQueryResult<{ listArticles: List<ArticleResource> }> | undefined
	> {
		return await this.apollo
			.query<{
				listArticles: List<ArticleResource>
			}>({
				query: gql`
					query ListArticles(
						$publishers: [String!]
						$excludeFeeds: [String!]
						$limit: Int
						$offset: Int
					) {
						listArticles(
							publishers: $publishers
							excludeFeeds: $excludeFeeds
							limit: $limit
							offset: $offset
						) {
							${queryData}
						}
					}
				`,
				variables,
				errorPolicy
			})
			.toPromise()
	}
	//#endregion
}
