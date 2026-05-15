import {Request} from 'express'
import * as model from '../../../lib/model'
import {Course} from '../../../lib/model'
import {courseSearch} from '../../../lib/service/catalog/courseCatalogueClient'
import {buildParams, typesType} from '../../../lib/service/catalog/models/courseSearchParams'
import {getAreasOfWork, getInterests} from '../../../lib/service/civilServantRegistry/csrsService'
import * as csrsService from '../../../lib/service/civilServantRegistry/csrsService'
import * as courseRecordClient from '../../../lib/service/cslService/courseRecord/client'
import {CourseRecord} from '../../../lib/service/cslService/models/courseRecord'
import {RecordState} from '../../../lib/service/cslService/models/record'
import {getPagination} from '../../../lib/utils/search'
import {CourseSearchQuery} from './models/courseSearchQuery'
import {SearchFilter, SearchPageModel, SearchCourse, SearchFilterable} from './models/searchPageModel'

export async function searchForCourses(params: CourseSearchQuery, req: Request, departmentHierarchyCodes: string[]) {
	const user = req.user
	const searchQuery = buildParams(params)
	const searchResults = await courseSearch(searchQuery, user, departmentHierarchyCodes)
	const courseRecords: Map<string, CourseRecord> = new Map(
		(
			await courseRecordClient.getCourseRecords(
				searchResults.results.map(r => r.id),
				user
			)
		).map((cr): [string, CourseRecord] => [cr.courseId, cr])
	)

	const formattedCourses: SearchCourse[] = getFormattedCourses(searchResults.results, courseRecords)

	const [departmentFilters, areaOfWorkFilters, interestFilters] = await Promise.all([
		getDepartmentFilters(user, params.department),
		getAreaOfWorkFilters(user, params.areaOfWork),
		getInterestsFilters(user, params.interest),
	])

	const filters = {
		showFree: params.cost !== undefined && params.cost === 'free',
		...departmentFilters,
		...areaOfWorkFilters,
		...interestFilters,
		selectedLearningTypes: Object.entries(req.__('courseTypes')).map(value => {
			return {
				label: value[1],
				value: value[0],
				checked: params.courseType.includes(value[0] as typesType),
				id: value[0],
			}
		}),
	}

	const pagination = getPagination(params, searchResults)

	return new SearchPageModel(filters, params.q, formattedCourses, pagination)
}

export function getFormattedCourses(results: Course[], courseRecords: Map<string, CourseRecord>): SearchCourse[] {
	return results.map(c => {
		const record = courseRecords.get(c.id)
		let inLearningPlan = c.isRequired()
		let state: RecordState = ''
		if (record && record.state) {
			state = record.state
			if (record.state !== 'ARCHIVED') {
				inLearningPlan = !!record || c.isRequired()
			}
		}
		return {
			costInPounds: c.getCost() || 0,
			duration: c.getDurationSeconds(),
			id: c.id,
			moduleCount: c.getModules().length,
			shortDescription: c.shortDescription,
			type: c.getType(),
			title: c.title,
			status: state,
			inLearningPlan,
		}
	})
}

interface FilterResult {
	userSelection: SearchFilter[]
	otherSelection: SearchFilter[]
}

export function processFilters(
	selectedValues: string[],
	profileFilters: SearchFilterable[],
	allValues: SearchFilterable[]
): FilterResult {
	const profileValues = profileFilters.map(v => v.getValue()).filter(v => v !== "I don't know")
	const result: FilterResult = {
		userSelection: [],
		otherSelection: [],
	}
	allValues.forEach(value => {
		const filter: SearchFilter = {
			...value.getAsSearchFilter(),
			checked: selectedValues.includes(value.getValue()),
		}
		if (profileValues.includes(value.getValue())) {
			result.userSelection.push(filter)
		} else {
			result.otherSelection.push(filter)
		}
	})
	return result
}

async function getDepartmentFilters(
	user: model.User,
	selectedDepartmentCodes: string[]
): Promise<{otherOrganisationalUnits: SearchFilter[]; userOrganisationalUnits: SearchFilter[]}> {
	const result = processFilters(
		selectedDepartmentCodes,
		[user.organisationalUnit!],
		await csrsService.getOrganisationalUnitsForSearch(user)
	)
	return {userOrganisationalUnits: result.userSelection, otherOrganisationalUnits: result.otherSelection}
}

async function getAreaOfWorkFilters(
	user: model.User,
	selectedAreasOfWork: string[]
): Promise<{otherAreasOfWork: SearchFilter[]; userAreasOfWork: SearchFilter[]}> {
	const allAreasOfWork = (await getAreasOfWork(user)).topLevelList
	const result = processFilters(selectedAreasOfWork, user.getAllAreasOfWork(), allAreasOfWork)
	return {otherAreasOfWork: result.otherSelection, userAreasOfWork: result.userSelection}
}

async function getInterestsFilters(
	user: model.User,
	selectedInterests: string[]
): Promise<{otherInterests: SearchFilter[]; userInterests: SearchFilter[]}> {
	const allInterests = (await getInterests(user)).list
	const result = processFilters(selectedInterests, user.interests || [], allInterests)
	return {otherInterests: result.otherSelection, userInterests: result.userSelection}
}
