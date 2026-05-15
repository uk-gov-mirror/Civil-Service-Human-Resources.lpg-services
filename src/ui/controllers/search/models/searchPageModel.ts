import {BasicCourse} from '../../../../lib/service/cslService/models/learning/learningPlan/basicCourse'
import {Pagination} from '../../../../lib/utils/search'

export class SearchCourse extends BasicCourse {
	public inLearningPlan: boolean
}

export interface SearchFilter extends SearchLabel {
	checked: boolean
}

export interface SearchLabel {
	id: string
	value: string
	label: string
}

export interface SearchFilterable {
	getAsSearchFilter(): SearchLabel
	getValue(): string
}

export interface Filters {
	selectedLearningTypes: SearchFilter[]
	showFree: boolean
	otherOrganisationalUnits: SearchFilter[]
	userOrganisationalUnits: SearchFilter[]
	userAreasOfWork: SearchFilter[]
	otherAreasOfWork: SearchFilter[]
	userInterests: SearchFilter[]
	otherInterests: SearchFilter[]
}

export class SearchPageModel {
	constructor(
		public filters: Filters,
		public query: string,
		public searchResults: SearchCourse[],
		public pagination: Pagination
	) {}
}
