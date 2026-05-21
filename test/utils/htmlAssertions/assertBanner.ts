import {within} from '@testing-library/dom'
import {expect} from 'chai'
import {JSDOM} from 'jsdom'

export interface BannerAssertion {
	title: string
	message: string
	actions?: {
		text: string
		href: string
	}[]
}

export const assertBanner = (html: string, expectedBanner: BannerAssertion) => {
	const doc = new JSDOM(html).window.document
	const bannerHtml = doc.getElementsByClassName('banner')[0] as HTMLElement
	expect(bannerHtml).to.not.eql(null)

	const banner = within(bannerHtml)
	banner.getByText(expectedBanner.title)
	banner.getByText(expectedBanner.message)

	if (expectedBanner.actions !== undefined) {
		for (const expectedAction of expectedBanner.actions) {
			const actionLink = banner.getByRole('link', {
				name: expectedAction.text
			})

			expect(actionLink.getAttribute('href')).to.eql(expectedAction.href)
		}
	}
}