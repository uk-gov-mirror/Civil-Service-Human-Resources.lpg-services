import {expect} from 'chai'
import * as express from 'express'
import * as nunjucks from 'nunjucks'
import {FEEDBACK_URL} from '../../../lib/config'
import * as nunjucksMiddleware from './nunjucks'

describe('Nunjucks middleware tests', () => {
	it('should register feedbackRoot global correctly in nunjucks environment', () => {
		const app = express()
		nunjucksMiddleware.register(app)

		const rendered = nunjucks.renderString('{{ feedbackRoot }}', {})
		expect(rendered).to.equal(FEEDBACK_URL)
	})
})
