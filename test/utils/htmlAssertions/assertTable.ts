import {within} from '@testing-library/dom'
import {expect} from 'chai'
import {JSDOM} from 'jsdom'

export interface TableAssertion {
	heading: string[]
	rows: string[][]
}

export const assertTable = (tableElement: HTMLElement, expectedTable: TableAssertion) => {
	const table = within(tableElement)

	const thElements = table.getAllByRole('columnheader')
	expect(thElements.length).to.eql(expectedTable.heading.length)

	for (let i = 0; i < expectedTable.heading.length; i++) {
		const actualText = thElements[i].textContent?.replace(/\s+/g, ' ').trim()
		expect(actualText).to.eql(expectedTable.heading[i])
	}

	const rowElements = table.getAllByRole('row').filter(row => {
		return row.parentElement?.tagName.toLowerCase() === 'tbody'
	})

	expect(rowElements.length).to.eql(expectedTable.rows.length)

	for (let i = 0; i < expectedTable.rows.length; i++) {
		const expectedCells = expectedTable.rows[i]
		const row = within(rowElements[i])

		const tdElements = row.getAllByRole('cell')
		expect(tdElements.length).to.eql(expectedCells.length)

		for (let j = 0; j < expectedCells.length; j++) {
			const actualText = tdElements[j].textContent?.replace(/\s+/g, ' ').trim()
			expect(actualText).to.eql(expectedCells[j])
		}
	}
}

export const assertTables = (html: string, expectedTables: TableAssertion[]) => {
	const doc = new JSDOM(html).window.document
	const tableHtmls = doc.getElementsByTagName('table')
	for (let i = 0; i < expectedTables.length; i++) {
		const expectedTable = expectedTables[i]
		assertTable(tableHtmls[i] as HTMLElement, expectedTable)
	}
}
