import * as express from 'express'
import {User} from '../../../lib/model'
import {getCategoryHomepage} from '../../../lib/service/cslService/cslServiceClient'

export async function index(req: express.Request, res: express.Response) {
	if (!(req.user as User).hasRole('LEARNING_TAG_MANAGER')) {
		return res.redirect('/home')
	}
	const homepage = await getCategoryHomepage(req.user)
	return res.render('nsg/index.njk', {homepage})
}
