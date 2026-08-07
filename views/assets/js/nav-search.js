class Element {
	elem
	hidden = false

	constructor(elem) {
		this.elem = elem
		this.hidden = !this.elem.classList.contains(hiddenModifier)
	}

	show() {
		this.elem.classList.remove(hiddenModifier)
		this.hidden = false
	}

	hide() {
		this.elem.classList.add(hiddenModifier)
		this.hidden = true
	}
}

class ActiveElem extends Element {
	active = false

	constructor(elem) {
		super(elem)
		this.active = this.elem.classList.contains(activeModifier)
	}

	activate() {
		this.elem.classList.add(activeModifier)
		this.active = true
	}

	deactivate() {
		this.elem.classList.remove(activeModifier)
		this.active = false
	}
}

/*
Constants
 */
const hiddenModifier = 'hidden'
const activeModifier = 'active'
const navSearchToggleId = 'nav-search-toggle'
const navSearchToggleOpenId = 'nav-search-toggle-open'
const navSearchToggleCloseId = 'nav-search-toggle-close'
const navSearchPanelId = 'nav-search-panel'
const searchBoxId = "q"

const navSearchToggle = document.getElementById(navSearchToggleId)
const navSearchToggleOpen = document.getElementById(navSearchToggleOpenId)
const navSearchToggleClose = document.getElementById(navSearchToggleCloseId)
const navSearchPanel = document.getElementById(navSearchPanelId)
const searchBox = document.getElementById(searchBoxId)

const requiredElems = [navSearchToggle, navSearchToggleOpen, navSearchToggleClose, navSearchPanel, searchBox]
if (!requiredElems.includes(null)) {
	/*
	Setup
	 */
	const navSearchToggleElem = new ActiveElem(navSearchToggle)
	const navSearchToggleOpenElem = new Element(navSearchToggleOpen)
	const navSearchToggleCloseElem = new Element(navSearchToggleClose)
	const navSearchPanelElem = new Element(navSearchPanel)

	navSearchToggleElem.show()

	if (searchBox.value){
		navSearchToggleElem.activate()
		navSearchToggleOpenElem.hide()
		navSearchToggleCloseElem.show()
		navSearchPanelElem.show()
	} else {
		navSearchToggleElem.deactivate()
		navSearchToggleOpenElem.show()
		navSearchToggleCloseElem.hide()
		navSearchPanelElem.hide()
	}

	navSearchToggle.addEventListener('click', () => {
		if (navSearchPanelElem.hidden) {
			navSearchToggleElem.activate()
			navSearchToggleOpenElem.hide()
			navSearchToggleCloseElem.show()
			navSearchPanelElem.show()
		} else {
			navSearchToggleElem.deactivate()
			navSearchToggleOpenElem.show()
			navSearchToggleCloseElem.hide()
			navSearchPanelElem.hide()
		}
	})
}
