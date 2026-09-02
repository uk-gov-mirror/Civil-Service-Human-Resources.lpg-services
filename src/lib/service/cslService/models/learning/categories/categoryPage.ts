import {Transform, Type} from 'class-transformer'
import {BasicCourseResponse} from '../learningPlan/basicCourseResponse'
import {CategoryLink} from './categoryLink'
import {Category} from './category'
import {HyperlinkResponse} from './hyperlinkResponse'

export class CategoryPage {
	@Type(() => CategoryLink)
	@Transform(({value}) => {
		return (value as CategoryLink[]).reverse()
	})
	parents: CategoryLink[]
	@Type(() => Category)
	categories: Category[]
	title: string
	description: string
	courseCount: number
	@Type(() => BasicCourseResponse)
	courses: BasicCourseResponse

	linkCount: number
	@Type(() => HyperlinkResponse)
	links: HyperlinkResponse

	getContentRows() {
		const rows = []
		for (let i = 0; i < this.getContent().length; i += 2) {
			const chunk = this.getContent().slice(i, i + 2)
			rows.push(chunk)
		}
		return rows
	}

	getContentResponse() {
		return this.courses.results.length > 0 ? this.courses : this.links
	}

	getContent() {
		return this.getContentResponse().results
	}

	getDisplay() {
		return this.courses.results.length > 0 ? 'courses' : 'links'
	}
}
