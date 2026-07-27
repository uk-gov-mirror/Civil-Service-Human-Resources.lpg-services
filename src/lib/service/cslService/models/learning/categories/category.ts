import * as CONFIG from '../../../../../config/index'
import {Transform} from 'class-transformer'

export class Category {
	public title: string
	public description: string
	@Transform(({value}) => {
		return `${CONFIG.LPG_UI_SERVER}/nsg-homepage/categories/${value}`
	})
	public url: string
}
