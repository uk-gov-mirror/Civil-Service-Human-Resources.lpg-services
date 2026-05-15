import {Type} from 'class-transformer'
import {BasicCourse} from './basicCourse'

export class BasicCourseResponse {
	@Type(() => BasicCourse)
	results: BasicCourse[]

	page: number
	totalResults: number
	size: number
}
