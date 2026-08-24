import {within} from '@testing-library/dom'
import {Express} from 'express'
import {CategoryHomepage} from '../../../src/lib/service/cslService/models/learning/categories/categoryHomepage'
import {CategoryPage} from '../../../src/lib/service/cslService/models/learning/categories/categoryPage'
import {CategoryLink} from '../../../src/lib/service/cslService/models/learning/categories/categoryLink'
import * as index from '../../../src/ui/controllers/nsg/controller'
import * as sinon from 'sinon'
import {client} from '../../../src/lib/service/cslService/baseConfig'
import {assertBreadcrumbs} from '../../utils/htmlAssertions/assertBreadcrumbs'
import {assertCategories} from '../../utils/htmlAssertions/assertHomepageCategory'
import {getApp} from '../../utils/testApp'
import {getDOM} from '../helpers'

describe('Homepage controller tests', () => {
	const sandbox = sinon.createSandbox()
	const app = getApp()
	app.use('/nsg-homepage', index.router)

	let cslServiceStub: sinon.SinonStubbedInstance<typeof client>

	beforeEach(() => {
		cslServiceStub = sandbox.stub(client)
		cslServiceStub._get.resolves({})
	})
	afterEach(() => {
		sandbox.restore()
	})

	async function makeRequest(e: Express, url: string) {
		return getDOM(e, url, {roles: 'LEARNING_TAG_MANAGER'})
	}

	it('should render the homepage title card', async () => {
		const homepageObject = new CategoryHomepage()
		homepageObject.categories = []
		cslServiceStub._get.resolves(homepageObject)

		const res = await makeRequest(app, '/nsg-homepage')
		within(res).getByRole('heading', {name: 'Welcome to the National School of Government and Public Services.'})
		within(res).getByText(
			'The National School provides world-class learning and development for civil servants, supporting public sector excellence and preparing our people for the future.'
		)
	})

	it('should render the homepage and any tier 1 categories', async () => {
		const homepageObject = new CategoryHomepage()
		homepageObject.categories = [
			{
				title: 'Category 1',
				description: 'this is category 1',
				url: 'category-1',
				categories: [],
			},
			{
				title: 'Category 2',
				description: 'this is category 2',
				url: 'category-2',
				categories: [],
			},
		]
		cslServiceStub._get.resolves(homepageObject)

		const res = await makeRequest(app, '/nsg-homepage')
		assertCategories(res, [
			{
				expTitle: 'Category 1',
				expDescription: 'this is category 1',
				expUrl: `/nsg-homepage/categories/category-1`,
			},
			{
				expTitle: 'Category 2',
				expDescription: 'this is category 2',
				expUrl: `/nsg-homepage/categories/category-2`,
			},
		])
	})

	it('should render the subcategories for a tier 1', async () => {
		const categoryPage = new CategoryPage()
		categoryPage.title = 'Subcategory 1'
		categoryPage.description = 'This is Subcategory 1'
		const parent = new CategoryLink()
		parent.link = 'category-1'
		parent.text = 'Category 1'
		categoryPage.parents = [parent]
		categoryPage.categories = [
			{
				title: 'Sub Subcategory 1',
				description: 'this is sub-subcategory 1',
				url: 'sub-subcategory-1',
				categories: [],
			},
		]
		cslServiceStub._get.resolves(categoryPage)

		const res = await makeRequest(app, `/nsg-homepage/categories/subcategory-1`)
		within(res).getByRole('heading', {name: 'Subcategory 1'})
		within(res).getByText('This is Subcategory 1')
		assertBreadcrumbs(res, [
			{
				expHref: '/nsg-homepage',
				expText: 'Home',
			},
			{
				expHref: `/nsg-homepage/categories/category-1`,
				expText: 'Category 1',
			},
		])
		assertCategories(res, [
			{
				expTitle: 'Sub Subcategory 1',
				expDescription: 'this is sub-subcategory 1',
				expUrl: `/nsg-homepage/categories/sub-subcategory-1`,
			},
		])
	})

	it('should render courses within a category page', async () => {
		const categoryPage = new CategoryPage()
		categoryPage.title = 'Subcategory 1'
		categoryPage.description = 'This is Subcategory 1'
		const parent = new CategoryLink()
		parent.link = 'category-1'
		parent.text = 'Category 1'
		categoryPage.parents = [parent]
		categoryPage.courses = {
			page: 0,
			size: 20,
			totalResults: 23,
			results: Array.from({length: 20}, (_, i) => i).map(i => {
				return {
					title: `Course ${i}`,
					status: 'IN_PROGRESS',
					id: `${i}`,
					costInPounds: 0,
					duration: 1,
					moduleCount: 1,
					type: 'blended',
					shortDescription: `Course ${i}`,
				}
			}),
		}
		categoryPage.categories = [
			{
				title: 'Sub Subcategory 1',
				description: 'this is sub-subcategory 1',
				url: 'sub-subcategory-1',
				categories: [],
			},
		]
		cslServiceStub._get.resolves(categoryPage)
		const res = await makeRequest(app, `/nsg-homepage/categories/subcategory-1`)
		within(res).getByRole('heading', {name: 'Courses'})
		within(res).getByRole('heading', {name: 'Course 1'})
		within(res).getByText('Showing 1 – 20 of 23 items')
		within(res).getByRole('link', {name: 'Page 2'})
		within(res).getByRole('link', {name: 'Next page'})
	})
})
