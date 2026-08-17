import {NextFunction, Request, Response, Router} from 'express'
import * as express from 'express'
import {ResourceNotFoundError} from '../../../lib/exception/ResourceNotFoundError'
import {getLogger} from '../../../lib/logger'
import {User} from '../../../lib/model'
import {getCategoryHomepage, getCategoryPage} from '../../../lib/service/cslService/cslServiceClient'
import {Category} from '../../../lib/service/cslService/models/learning/categories/category'
import * as asyncHandler from 'express-async-handler'
import {appInsights, appInsightsStarted} from '../../../server'

export const router: express.Router = Router()
const logger = getLogger('nsg/controller')

router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!(req.user as User).hasRole('LEARNING_TAG_MANAGER')) {
		return res.redirect('/')
	}
	next()
})

router.get('/', asyncHandler(index))
router.get('/categories/:url', asyncHandler(categoryPage))

router.use(async (error: any, request: Request, response: Response, next: NextFunction) => {
	console.error(error)
	if (error instanceof ResourceNotFoundError) {
		return response.render('nsg/notFound.njk')
	}
	try {
		if (appInsightsStarted) {
			appInsights.defaultClient.trackException({exception: error})
		}
	} catch {
		logger.error('Application insights failed to log the error')
	}
	logger.error(`Error handling request for ${request.method} ${request.url}\nStack: ${error.stack}`)
	if (error.response && error.response.status === 401) {
		return response.redirect('/sign-out')
	}
	response.status(500)
	return response.render('nsg/error.njk')
})

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
	const page = await getCategoryPage(req.user, url)
	return res.render('nsg/categoryPage.njk', {page})
}
