import {Transform} from 'class-transformer'

export class CataloguePageParams {
	@Transform(({value}) => {
		value = value - 1
		return +value
	})
	p: number = 0

	letter: string = 'a'

	getAsUrlParams(page?: number): string | undefined {
		const p = page ? `?p=${page}` : ''
		return `/course-catalogue/a-z/${this.letter}` + p
	}
}
