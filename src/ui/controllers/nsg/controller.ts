import {plainToInstance} from 'class-transformer'
import {Router} from 'express'
import * as express from 'express'
import {User} from '../../../lib/model'
import {getCategoryHomepage, getCategoryPage} from '../../../lib/service/cslService/cslServiceClient'
import {Category} from '../../../lib/service/cslService/models/learning/categories/category'
import * as asyncHandler from 'express-async-handler'
import {getPagination, Pagination, transformNumberedPagesToGovuk} from '../../../lib/utils/search'
import {CoursePaginationQuery} from './model/coursePaginationQuery'

export const router: express.Router = Router()

router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!(req.user as User).hasRole('LEARNING_TAG_MANAGER')) {
		return res.redirect('/')
	}
	next()
})

router.get('/', asyncHandler(index))
router.get('/categories/:url', asyncHandler(categoryPage))

export async function index(req: express.Request, res: express.Response) {
	const homepage = await getCategoryHomepage(req.user)
	const cardsPerRow = homepage.categories.length % 2 === 0 ? 2 : 3
	const rows: Category[][] = []
	for (let i = 0; i < homepage.categories.length; i += cardsPerRow) {
		const chunk = homepage.categories.slice(i, i + cardsPerRow)
		rows.push(chunk)
	}
	return res.render('nsg/index.njk', {rows, cardsPerRow})
}

export async function categoryPage(req: express.Request, res: express.Response) {
	const url = req.params.url
	const query = plainToInstance(CoursePaginationQuery, {...req.query, categoryUrl: url})
	const page = await getCategoryPage(req.user, url)
	let pagination: Pagination | undefined
	if (page.getCourses().length > 0) {
		pagination = getPagination(query, page.courses)
		pagination.numberedPages = transformNumberedPagesToGovuk(pagination.numberedPages)
	}
	return res.render('nsg/categoryPage.njk', {page, pagination})
}
