import * as express from 'express'
import {User} from '../../../lib/model'

export async function index(req: express.Request, res: express.Response) {
	if (!(req.user as User).hasRole('LEARNING_TAG_MANAGER')) {
		return res.redirect("/home")
	}
	return res.render('nsg/index.njk')
}
