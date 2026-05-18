import dayjs = require('dayjs')
import duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

export function getDayJs() {
	return dayjs
}
