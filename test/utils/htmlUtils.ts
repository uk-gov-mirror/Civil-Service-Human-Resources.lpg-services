import {within} from '@testing-library/dom'
import {expect} from 'chai'

export const assertBackLink = (body: HTMLElement, expHref: string, expText: string) => {
	expect(
		within(body.getElementsByClassName('link-back')[0] as HTMLElement)
			.getByText(expText)
			.getAttribute('href')
	).to.eql(expHref)
}

export const assertButton = (body: HTMLElement, expText: string, expHref: string) => {
	expect(
		within(body.querySelector('main .button') as HTMLElement)
			.getByText(expText)
			.getAttribute('href')
	).to.eql(expHref)
}

export const assertNotificationBanner = (body: HTMLElement, expTitle: string | null, expContent: string | null) => {
	const exp = [
		['govuk-notification-banner-title', expTitle],
		['govuk-notification-banner-content', expContent],
	]
	exp.forEach(e => {
		const elem = body.querySelector(`#${e[0]}`)
		if (e[1] === null) {
			expect(elem).to.eql(null)
		} else {
			within(elem as HTMLElement).getByText(e[1])
		}
	})
}
