import {within} from '@testing-library/dom'
import {expect} from 'chai'

export interface BannerAssertion {
	title: string
	message: string
	actions?: {
		text: string
		href: string
	}[]
}

export const assertBanner = (html: HTMLElement, expectedBanner: BannerAssertion) => {
	const bannerHtml = html.getElementsByClassName('banner')[0] as HTMLElement
	expect(bannerHtml).to.not.eql(null)

	const banner = within(bannerHtml)
	banner.getByText(expectedBanner.title)
	banner.getByText(expectedBanner.message)

	if (expectedBanner.actions !== undefined) {
		for (const expectedAction of expectedBanner.actions) {
			const actionLink = banner.getByRole('link', {
				name: expectedAction.text,
			})

			expect(actionLink.getAttribute('href')).to.eql(expectedAction.href)
		}
	}
}
