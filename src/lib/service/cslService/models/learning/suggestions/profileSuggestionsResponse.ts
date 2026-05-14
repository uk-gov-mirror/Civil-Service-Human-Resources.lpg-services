import {Type} from 'class-transformer'
import {SuggestionSection} from '../../../../../../ui/controllers/suggestions/model/suggestionSection'

export class ProfileSuggestionsResponse {
	@Type(() => SuggestionSection)
	public suggestions: SuggestionSection[]

	getAllCourses() {
		return this.suggestions.flatMap(courses => courses.courses)
	}
}
