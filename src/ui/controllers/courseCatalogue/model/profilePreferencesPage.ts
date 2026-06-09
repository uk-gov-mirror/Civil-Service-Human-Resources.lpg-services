import {Type} from 'class-transformer'
import {SuggestionSection} from './suggestionSection'

export class ProfilePreferencesPage {
	@Type(() => SuggestionSection)
	public sections: SuggestionSection[]

	constructor(sections: SuggestionSection[]) {
		this.sections = sections
	}
}
