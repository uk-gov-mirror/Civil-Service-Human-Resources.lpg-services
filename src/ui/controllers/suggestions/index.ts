import {Request} from 'express'
import * as express from 'express'
import {ICourse} from '../../../lib/model'
import * as model from '../../../lib/model'
import {fetchSuggestedLearning} from '../../../lib/service/catalog/suggestedLearning/suggestedLearningService'
import {Suggestion} from '../../../lib/service/catalog/suggestedLearning/suggestion'
import * as cslService from '../../../lib/service/cslService/cslServiceClient'
import {BasicCourse} from '../../../lib/service/cslService/models/learning/learningPlan/basicCourse'
import {ActionBanner, generateNotificationBanner} from '../home'

function generateActionBanner(request: Request, learningPlan: ICourse[]): ActionBanner | null {
	const courseId: string | undefined = request.query.delete
	if (courseId) {
		const course = learningPlan.find(c => {
			return c.id === courseId
		})
		if (course) {
			return {
				title: request.__('suggestions_delete_title', course.title),
				message: request.__('suggestions_delete_message'),
				yesText: request.__('suggestions_delete_yes_option'),
				yesHref: `/suggestions-for-you/remove/${courseId}`,
				noText: request.__('suggestions_delete_no_option'),
				noHref: '/suggestions-for-you',
			}
		}
	}
	return null
}

export async function addToPlan(req: express.Request, res: express.Response) {
	const ref = req.query.ref

	let redirectTo = '/suggestions-for-you'
	const courseId = req.params.courseId
	switch (ref) {
		case 'home':
		case 'search':
			redirectTo = '/'
			break
		case 'course':
			redirectTo = `/courses/${courseId}`
			break
	}
	const resp = await cslService.addCourseToLearningPlan(req.params.courseId, req.user)

	req.flash('successTitle', req.__('learning_added_to_plan_title', resp.courseTitle))
	req.flash('successMessage', req.__('learning_added_to_plan_message', resp.courseTitle))
	req.flash('successId', courseId)
	req.session!.save(() => {
		res.redirect(redirectTo)
	})
}
export async function removeFromSuggestions(req: express.Request, res: express.Response) {
	const ref = req.query.ref === 'home' || req.query.ref === 'search' ? '/' : '/suggestions-for-you'
	const courseId = req.params.courseId
	const resp = await cslService.removeCourseFromSuggestions(courseId, req.user)
	req.flash('successTitle', req.__('learning_removed_from_plan_title', resp.courseTitle))
	req.flash('successMessage', req.__('learning_removed_from_suggestions', resp.courseTitle))
	res.redirect(ref)
}

export async function suggestionsPage(req: express.Request, res: express.Response) {
	const user = req.user as model.User
	const map = await fetchSuggestedLearning(user, res.locals.departmentHierarchyCodes)
	type section = {
		title: string
		url: string
		courses: BasicCourse[]
	}
	const sections: section[] = []

	sections.push({
		title: user.organisationalUnit!.name,
		url: `/search?department=${user.organisationalUnit!.code}`,
		courses: map.getMapping(Suggestion.DEPARTMENT).get(user.organisationalUnit!.code) || [],
	})

	map.getMapping(Suggestion.AREA_OF_WORK).forEach((value, key) => {
		sections.push({
			title: key,
			url: `/search?areaOfWork=${key}`,
			courses: value,
		})
	})

	map.getMapping(Suggestion.OTHER_AREAS_OF_WORK).forEach((value, key) => {
		sections.push({
			title: key,
			url: `/search?areaOfWork=${key}`,
			courses: value,
		})
	})

	map.getMapping(Suggestion.INTERESTS).forEach((value, key) => {
		sections.push({
			title: key,
			url: `/search?interest=${key}`,
			courses: value,
		})
	})

	const allCourses = map.getAllCourses()
	const notificationBanner = await generateNotificationBanner(req, allCourses)
	const actionBanner = generateActionBanner(req, allCourses)

	res.render('suggestions-for-you/index.njk', {
		sections,
		banners: {
			notification: notificationBanner,
			action: actionBanner,
		},
	})
}
