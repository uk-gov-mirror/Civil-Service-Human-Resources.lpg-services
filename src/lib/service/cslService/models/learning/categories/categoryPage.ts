import {Transform, Type} from 'class-transformer'
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
}
