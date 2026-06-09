export interface Response<T> {
	results: T[]
	page: number
	totalResults: number
	size: number
}
