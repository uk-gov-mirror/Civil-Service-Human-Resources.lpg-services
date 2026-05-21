import {within} from '@testing-library/dom'
import {expect} from 'chai'
import {JSDOM} from 'jsdom'



export const assertH1AndTitle = (doc: string, expTitle: string, expH1: string) => {
	const body = new JSDOM(doc).window.document
	const page = within(body.body)
	page.getByRole('heading', {name: expH1})
	expect(body.title).to.eql(`${expTitle} - Civil Service Learning`)
}

export const assertBackLink = (doc: string, expHref: string, expText: string) => {
	const body = new JSDOM(doc).window.document.body
	expect(
		within(body.getElementsByClassName('link-back')[0] as HTMLElement)
			.getByText(expText)
			.getAttribute('href')
	).to.eql(expHref)
}

export const assertButton = (doc: string, expText: string, expHref: string) => {
	const body = new JSDOM(doc).window.document.body
	expect(
		within(body.getElementsByClassName('button')[0] as HTMLElement)
			.getByText(expText)
			.getAttribute('href')
	).to.eql(expHref)
}

export const assertNotificationBanner = (doc: string, expTitle: string | null, expContent: string | null) => {
	const body = new JSDOM(doc).window.document.body
	const exp = [['govuk-notification-banner-title', expTitle], ['govuk-notification-banner-content', expContent]]
	exp.forEach(e => {
		const elem = body.querySelector(`#${e[0]}`)
		if (e[1] === null) {
			expect(elem).to.eql(null)
		} else {
			within(elem as HTMLElement).getByText(e[1])
		}
	})
}
