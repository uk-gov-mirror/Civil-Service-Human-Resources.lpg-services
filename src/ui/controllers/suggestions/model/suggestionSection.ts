import {Type} from 'class-transformer'
import {BasicCourse} from '../../../../lib/service/cslService/models/learning/learningPlan/basicCourse'

export class SuggestionSection {
	public title: string
	@Type(() => BasicCourse)
	public courses: BasicCourse[]

	constructor(title: string, course: BasicCourse[]) {
		this.title = title
		this.courses = course
	}
}
