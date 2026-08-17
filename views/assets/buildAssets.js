const fs = require('fs')
const {join} = require('path')

const version = {
	id: crypto.randomUUID(),
}

const strVersion = JSON.stringify(version, null, 2)

try {
	console.log(`Building version JSON: ${strVersion}`)
	const filename = join(__dirname, './asset-version.json')
	fs.writeFileSync(filename, strVersion, 'utf8')
} catch (error) {
	console.error('Error writing file:', error.message)
}