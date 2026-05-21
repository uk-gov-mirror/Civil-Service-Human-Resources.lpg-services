import {within} from '@testing-library/dom'
import {expect} from 'chai'
import {JSDOM} from 'jsdom'

export interface ModuleCardCta {
	text: string
	href?: string
	screenReaderText?: string
	openInNewTab?: boolean
}

export interface ModuleCardAssertion {
	expTitle: string
	expDescription: string
	expOptional: boolean
	cta: ModuleCardCta
	details?: {
		expType: string
		expDuration?: string
		expState?: string | null
		expCost?: string | null
	}
}

export const assertModuleCards = (html: string, expValues: ModuleCardAssertion[]) => {
	const page = new JSDOM(html).window.document
	const cardHtmls = page.getElementsByClassName('discite__item u-clearfix discite__item--module')
	for (let i = 0; i < cardHtmls.length; i++) {
		console.log(cardHtmls[i].outerHTML)
	}
	expect(cardHtmls.length).to.eql(expValues.length)

	for (let i = 0; i < expValues.length; i++) {
		assertModuleCard(cardHtmls[i] as HTMLElement, expValues[i])
	}
}

export const assertModuleCard = (elem: HTMLElement, expValue: ModuleCardAssertion) => {
	const card = within(elem)

	card.getByRole('heading', {name: expValue.expTitle})
	card.getByText(expValue.expDescription)

	if (expValue.expOptional) {
		card.getByText('This module is optional')
	}

	const details = expValue.details
	if (details) {
		card.getByText(details.expType)

		if (details.expCost !== undefined) {
			if (details.expCost !== null) {
				card.getByText(`£${details.expCost}`)
			} else {
				expect(elem.querySelector('span.lpg-course-cost')).to.eql(null)
			}
		}

		if (details.expDuration) {
			card.getByText(details.expDuration)
		}

		if (details.expState !== undefined) {
			if (details.expState === null) {
				expect(elem.querySelector('div.discite__status')).to.eql(null)
			} else {
				card.getByText(details.expState)
			}
		}
	}

	const {cta} = expValue
	if (cta.href) {
		const ctaLink = card.getByRole('link', {name: cta.text})
		expect(ctaLink.getAttribute('href')).to.eql(cta.href)

		if (cta.openInNewTab) {
			expect(ctaLink.getAttribute('target')).to.eql('_blank')
		}
	} else {
		card.getByText(cta.text)
	}
}
