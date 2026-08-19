import {Transform, Type} from 'class-transformer'
import {BasicCourseResponse} from '../learningPlan/basicCourseResponse'
import {CategoryLink} from './categoryLink'
import {Category} from './category'

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
	@Type(() => BasicCourseResponse)
	courses: BasicCourseResponse

	getCourses() {
		return this.courses === undefined ? [] : this.courses.results
	}

	getRows() {
		const rows = []
		for (let i = 0; i < this.getCourses().length; i += 2) {
			const chunk = this.getCourses().slice(i, i + 2)
			rows.push(chunk)
		}
		return rows
	}
}
