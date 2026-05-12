import {Request} from 'express'
import * as express from 'express'
import {ICourse} from '../../../lib/model'
import * as cslService from '../../../lib/service/cslService/cslServiceClient'
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

export async function suggestionsPage(req: express.Request, res: express.Response) {
	const suggestedLearning = await cslService.getProfileSuggestions(req.user)
	const allCourses = suggestedLearning.getAllCourses()
	const notificationBanner = await generateNotificationBanner(req, allCourses)
	const actionBanner = generateActionBanner(req, allCourses)

	res.render('suggestions-for-you/index.njk', {
		sections: suggestedLearning.suggestions,
		banners: {
			notification: notificationBanner,
			action: actionBanner,
		},
	})
}
