/*  controls header toggle and blur  */

/* MENU DISPLAY */
const navMenu = document.getElementById('nav-menu'),
	navToggle = document.getElementById('nav-toggle'),
	navClose = document.getElementById('nav-close')

/* SHOW */
if (navToggle) {
	navToggle.addEventListener('click', () => {
		navMenu.classList.add('show-menu')
	})
}

/* HIDE */
if (navClose) {
	navClose.addEventListener('click', () => {
		navMenu.classList.remove('show-menu')
	})
}

/* REMOVE MENU MOBILE */
const navLink = document.querySelectorAll('.nav_link')

const linkAction = () => {
	const navMenu = document.getElememntById('nav-menu')
	navMenu.classList.remove('nav-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/* BLUR */
//const blurHeader = () => {
//	const header = document.getElementById('header')
//	this.scrollY >= 50 ? header.classList.add('blur-header')
//		: header.classList.remove('blur-header')
//}
//window.addEventListener('scroll', blurHeader)