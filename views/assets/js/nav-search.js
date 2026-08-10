class Element {
	hiddenModifier = 'hidden'
	elem
	hidden = false

	constructor(elem) {
		this.elem = elem
		this.hidden = !this.elem.classList.contains(this.hiddenModifier)
	}

	show() {
		this.elem.classList.remove(this.hiddenModifier)
		this.hidden = false
	}

	expand() {
		this.show()
		this.elem.setAttribute('aria-expanded', 'true')
	}

	hide() {
		this.elem.classList.add(this.hiddenModifier)
		this.hidden = true
	}

	collapse() {
		this.hide()
		this.elem.setAttribute('aria-expanded', 'false')
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
	navSearchPanelElem.collapse()

	if (searchBox.value){
		navSearchToggleElem.activate()
		navSearchToggleOpenElem.hide()
		navSearchToggleCloseElem.show()
		navSearchPanelElem.expand()
	} else {
		navSearchToggleElem.deactivate()
		navSearchToggleOpenElem.show()
		navSearchToggleCloseElem.hide()
		navSearchPanelElem.collapse()
	}

	navSearchToggle.addEventListener('click', () => {
		if (navSearchPanelElem.hidden) {
			navSearchToggleElem.activate()
			navSearchToggleOpenElem.hide()
			navSearchToggleCloseElem.show()
			navSearchPanelElem.expand()
		} else {
			navSearchToggleElem.deactivate()
			navSearchToggleOpenElem.show()
			navSearchToggleCloseElem.hide()
			navSearchPanelElem.collapse()
		}
	})
}
