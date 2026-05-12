import {BasicCourse} from '../../cslService/models/learning/learningPlan/basicCourse'
import {Suggestion} from './suggestion'

export class SuggestionsMap {
	private map: Map<Suggestion, Map<string, BasicCourse[]>> = new Map()
	private courses: BasicCourse[] = []

	addToMap(suggestion: Suggestion, key: string, courses: BasicCourse[]) {
		const mappings = this.getMapping(suggestion)
		mappings.set(key, courses)
		this.map.set(suggestion, mappings)
		this.courses.push(...courses)
	}

	getMapping(suggestion: Suggestion) {
		let mappings = this.map.get(suggestion)
		if (!mappings) {
			mappings = new Map()
		}
		return mappings
	}

	getAllCourses(): BasicCourse[] {
		return this.courses
	}

	getCourse(id: string) {
		return this.getAllCourses().find(course => course.id === id)
	}
}
