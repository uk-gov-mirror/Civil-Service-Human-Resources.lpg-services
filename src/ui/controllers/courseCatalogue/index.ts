import {plainToInstance} from 'class-transformer'
import * as express from 'express'
import * as cslService from '../../../lib/service/cslService/cslServiceClient'
import {getPagination} from '../../../lib/utils/search'
import {generateNotificationBanner} from '../home'
import {CataloguePageParams} from './model/cataloguePageParams'

const aToZRegex = new RegExp('[a-zA-Z]')

export async function addToPlan(req: express.Request, res: express.Response) {
	const ref = req.query.ref

	let redirectTo = '/course-catalogue/profile-preferences'
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

export async function renderCourseCatalogue(req: express.Request, res: express.Response) {
	return await renderAtoZ(req, res)
}

export async function renderAtoZ(req: express.Request, res: express.Response) {
	if (!aToZRegex.test(req.params.letter)) {
		return res.redirect('/course-catalogue/a-z')
	}
	const params = plainToInstance(CataloguePageParams, {...req.query, ...req.params})
	console.log(params)
	const response = await cslService.getAtoZ(params.letter, params.p, req.user)
	const pagination = getPagination(params, response)
	res.render('course-catalogue/a-to-z/index.njk', {
		...params,
		...response,
		pagination,
	})
}

export async function profilePreferencesPage(req: express.Request, res: express.Response) {
	const suggestedLearning = await cslService.getProfileSuggestions(req.user)
	const allCourses = suggestedLearning.getAllCourses()
	const notificationBanner = await generateNotificationBanner(req, allCourses)

	res.render('course-catalogue/profile-preferences/index.njk', {
		sections: suggestedLearning.suggestions,
		banners: {
			notification: notificationBanner,
		},
	})
}
