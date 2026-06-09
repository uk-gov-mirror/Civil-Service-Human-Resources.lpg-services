import {expect} from 'chai'
import {Express} from 'express'
import {JSDOM} from 'jsdom'
import * as request from 'supertest'

export interface AssertDOM {
	title: string
}

export const getDOM = async (
	app: Express,
	url: string,
	setOverride?: {roles: string; flashes?: string[]; locals?: string},
	expectedValues?: AssertDOM
): Promise<HTMLElement> => {
	const set = setOverride !== undefined ? setOverride : {roles: 'LEARNER'}
	const res = await request(app).get(url).set(set)
	expect(res.status).eql(200)
	const dom = new JSDOM(res.text).window.document
	if (expectedValues) {
		expect(dom.title).to.eq(`${expectedValues.title} - Civil Service Learning`)
	}
	return dom.body
}
