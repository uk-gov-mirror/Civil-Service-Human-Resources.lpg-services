import {Expose, Transform, Type} from 'class-transformer'
import {NSG_ROUTER_BASE} from '../../../../../config'
import {CategoryLink} from './categoryLink'

export class Category {
	public title: string
	public description: string
	@Transform(({value}) => {
		return `${NSG_ROUTER_BASE}/categories/${value}`
	})
	public url: string
	@Type(() => CategoryLink)
	public categories: CategoryLink[]

	@Expose({name: 'contentLinks'})
	@Transform(({obj}) => {
		if (obj.categories.length > 0) {
			return obj.categories
		}
	})
	public contentLinks: CategoryLink[]
}
