import {Transform} from 'class-transformer'
import {NSG_FLAG} from '../../../../lib/config'
import {SearchParams} from '../../../../lib/utils/search'

export class CoursePaginationQuery implements SearchParams {
	@Transform(({value}) => {
		value = value - 1
		return +value
	})
	p: number = 0

	categoryUrl: string

	getAsUrlParams(page?: number) {
		const urlParts: string[] = []
		if (page) {
			urlParts.push(`p=${page}`)
		}
		return `${NSG_FLAG ? '/home' : '/nsg-homepage'}/categories/${this.categoryUrl}/courses?` + urlParts.join('&')
	}
}
