import {JSDOM} from 'jsdom'
import {assertHtml, HTML, HtmlAssertion, TextContainsAsserter, TextContentAsserter} from '../htmlUtils'
import {CourseCardAssertion} from './assertCourseCard'

export const assertLearningCard = (html: HTML, expValue: CourseCardAssertion) => {
	const assertions: HtmlAssertion[] = [
		{
			querySelector: '.learning-card__heading a',
			expected: {
				attributes: {
					href: expValue.expTitle.href,
				},
				content: new TextContentAsserter(expValue.expTitle.text),
			},
		},
		{
			querySelector:
				'.learning-card__details_list .learning-card__details_item:nth-of-type(1) .learning-card__details_value',
			expected: {
				content: new TextContentAsserter(expValue.properties.type),
			},
		},
		{
			querySelector:
				'.learning-card__details_list .learning-card__details_item:nth-of-type(2) .learning-card__details_value',
			expected: {
				content: new TextContentAsserter(expValue.properties.duration),
			},
		},
		{
			querySelector: '.learning-card__content',
			expected: {
				content: new TextContainsAsserter(expValue.expDescription),
			},
		},
		{
			querySelector: '.learning-card__actions .learning-card__action:nth-of-type(1)',
			expected: {
				content: new TextContentAsserter(expValue.cta.primary.text),
				attributes: {
					href: expValue.cta.primary.href,
				},
			},
		},
	]
	if (expValue.moduleCount > 1) {
		assertions.push({
			querySelector: '.learning-card__content',
			expected: {content: new TextContainsAsserter(`This course has ${expValue.moduleCount} modules`)},
		})
	}
	if (expValue.properties.cost) {
		assertions.push({
			querySelector:
				'.learning-card__details_list .learning-card__details_item:nth-of-type(3) .learning-card__details_value',
			expected: {
				content: new TextContentAsserter(expValue.properties.cost),
			},
		})
	}
	if (expValue.cta.secondary) {
		if (expValue.cta.secondary.href) {
			assertions.push(
				{
					querySelector: '.learning-card__actions .learning-card__action:nth-of-type(2)',
					expected: {
						content: new TextContentAsserter(expValue.cta.secondary.text),
						attributes: {
							href: expValue.cta.secondary.href!,
						},
					},
				}
			)
		} else {
			assertions.push(
				{
					querySelector: '.learning-card__actions span:nth-child(2)',
					expected: {
						content: new TextContentAsserter(expValue.cta.secondary.text),
					},
				}
			)
		}
	}
	assertHtml(html, assertions)
}
export const assertLearningCards = (html: string, expValues: CourseCardAssertion[]) => {
	const page = new JSDOM(html).window.document
	const cardHtmls = page.getElementsByClassName('learning-card')
	for (let i = 0; i < expValues.length; i++) {
		console.log(cardHtmls[i].outerHTML)
		assertLearningCard(cardHtmls[i], expValues[i])
	}
}
