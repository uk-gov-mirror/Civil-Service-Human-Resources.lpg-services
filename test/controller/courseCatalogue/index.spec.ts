import * as asyncHandler from 'express-async-handler'
import * as sinon from 'sinon'
import * as request from 'supertest'
import {client} from '../../../src/lib/service/cslService/baseConfig'
import * as courseCatalogue from '../../../src/ui/controllers/courseCatalogue/index'
import {assertLearningCards} from '../../utils/htmlAssertions/assertLearningCard'
import {getApp} from '../../utils/testApp'

describe('Course catalogue controller tests', () => {
	const sandbox = sinon.createSandbox()
	const app = getApp()
	app.get('/course-catalogue', asyncHandler(courseCatalogue.renderCourseCatalogue))

	let cslServiceClientStub: sinon.SinonStubbedInstance<typeof client>

	beforeEach(() => {
		cslServiceClientStub = sandbox.stub(client)
	})
	afterEach(() => {
		sandbox.restore()
	})

	it('Should default to the letter A of the catalogue when accessing index', async () => {
		cslServiceClientStub._get.resolves({
			results: [
				{
					id: 'a1',
					title: 'A course 1',
					shortDescription: 'Short description of A course 1',
					type: 'link',
					duration: 3600,
					moduleCount: 1,
					costInPounds: 0,
					status: 'IN_PROGRESS',
				},
				{
					id: 'a2',
					title: 'A course 2',
					shortDescription: 'Short description of A course 2',
					type: 'blended',
					duration: 3600,
					moduleCount: 2,
					costInPounds: 0,
					status: 'NULL',
				},
			],
		})

		const res = await request(app).get('/course-catalogue').set({roles: 'LEARNER'})
		assertLearningCards(res.text, [
			{
				cta: {
					primary: {
						href: '/courses/a1',
						text: 'Start A course 1',
					},
					secondary: {
						text: 'Already in your learning plan',
					},
				},
				properties: {
					type: 'Link',
					duration: '1 hour',
					cost: 'Free',
				},
				expTitle: {
					text: 'A course 1',
					href: '/courses/a1',
				},
				moduleCount: 1,
				expDescription: 'Short description of A course 1',
			},
			{
				cta: {
					primary: {
						href: '/courses/a2',
						text: 'Start A course 2',
					},
					secondary: {
						href: '/course-catalogue/add/a2',
						text: 'Add to learning plan : A course 2',
					},
				},
				properties: {
					type: 'Blended',
					duration: '1 hour',
					cost: 'Free',
				},
				expTitle: {
					text: 'A course 2',
					href: '/courses/a2',
				},
				moduleCount: 2,
				expDescription: 'Short description of A course 2',
			},
		])
	})

	describe('Profile preferences tests', () => {
		it('should display profile preference courses', () => {


		})
	})
})
