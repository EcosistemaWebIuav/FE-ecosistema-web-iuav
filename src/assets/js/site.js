/**
 * Global scripts
 */

window.addEventListener('load', (event) => {

    /**
     * Vars
     */

    //functional
    let vh = '100vh'
    let currentScrollPos = 0
    let prevScrollPos = 0
    let menuToggledScrollPos
    let menuIsOpen = false
    let desktopMenuIsOpen = false
    let mobileMenuIsOpen = false

    //media query
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    const isDesktop = window.matchMedia('(min-width: 80rem)')

    // DOM elements
    const body = document.body
    const header = document.querySelector('.site-header')
    const logo = document.querySelector('.site-logo')
    const a11y_ariaexpanded = document.querySelectorAll('[aria-expanded="false"]')
    const menuItems = document.querySelectorAll('#site-header-main-nav > ul > .menu-item-has-children')
    const menuBtn = document.getElementById('menu-btn')
    const overlay = document.getElementById('overlay')
    const menuMobile = document.getElementById('menu-mobile') 
    const pageWrapper = document.getElementById('site-content-wrapper')
    const accordionMenuItems = document.querySelectorAll('[data-toggle-menu-items]')
    const footer = document.getElementById('site-footer')


    /**
     * Check if iOS, then set --vh
     */
    if (isIOS && window.matchMedia("(max-width: 1024px)").matches) {
        document.documentElement.classList.add('is-ios')
    }
    
    function set100vh() {
        // If window size is iPad or smaller, then use JS to set screen height.
        if (isIOS && window.matchMedia("(max-width: 1024px)").matches) {
            vh = `${window.innerHeight}px`
            document.documentElement.style.setProperty("--vh", vh)
        }
    }
    set100vh()

    /**
     * WAI-ARIA toggle aria-expanded
     */
    function updateAriaExpanded(item){
        const ariaexpanded = item.getAttribute('aria-expanded')
        if (ariaexpanded == 'true') {
            item.setAttribute('aria-expanded', 'false')
        } else {
            item.setAttribute('aria-expanded', 'true')
        }
    }
    a11y_ariaexpanded.forEach((item) => {
        item.addEventListener('click', function () {
            updateAriaExpanded(this)
        })
    })

 
    /**
     * Get header height
     */
    function getHeaderHeight(){
        document.documentElement.style.setProperty("--header-height", `${header.clientHeight}px`)
    }

    getHeaderHeight()

    /**
     * Hide header if scrolling down, show if scrolling up
     */

    window.addEventListener('scroll', () => {
        
        currentScrollPos = window.scrollY

        // const currentScrollPos = window.scrollY

        //if you start scrolling add class
        if (currentScrollPos > 0 && !menuIsOpen) {
            body.classList.add('is-scrolled')
        } else{
            body.classList.remove('is-scrolled')
        }
        
        // if scrolling down, hide header and position logo to the left
        // if scrolling up, show header and logo in initial position
        if (prevScrollPos > 0 && prevScrollPos < currentScrollPos && !menuIsOpen) {
            header.classList.add('is-hidden')
            logo.classList.add('is-visible')
            overlay.classList.remove('is-active')
        } else if (prevScrollPos >= currentScrollPos && !menuIsOpen) {
            header.classList.remove('is-hidden')
            logo.classList.remove('is-visible')
        }
        
        prevScrollPos = currentScrollPos

    })

    /**
     * Menu
     */

    function toggleMenuSharedElements(){
               
        if (!menuIsOpen) {
            body.classList.add('has-menu-toggled')
            menuBtn.classList.add('is-active')
            menuBtn.classList.add('is-toggled')
            overlay.classList.add('is-active')
            menuIsOpen = true
        } else {
            body.classList.remove('has-menu-toggled')
            menuBtn.classList.remove('is-active')
            menuBtn.classList.remove('is-toggled')
            overlay.classList.remove('is-active')
            menuIsOpen = false
        }

    }

    // when menu is toggled, set margin top based
    // on scrolled px and restore scroll after menu is closed
    function setScrolledMarginContent(scrolled){
        if (mobileMenuIsOpen || desktopMenuIsOpen) {
            pageWrapper.style.marginTop = 0
            document.body.scrollTop = menuToggledScrollPos
            document.body.scrollTop = menuToggledScrollPos
            document.documentElement.scrollTop = menuToggledScrollPos
        } else {
            pageWrapper.style.marginTop = `-${scrolled}px`
        }
        menuToggledScrollPos = scrolled
    }
    
    function toggleMobileMenu(forceClosing = null){
        if (forceClosing) {
            menuMobile.classList.remove('is-toggled')
        } else {
            menuMobile.classList.toggle('is-toggled')
        }
        closeAllAccordionMenuItems()
        // set margin on page wapper 
        // and restore scrolled position when you close menu
        setScrolledMarginContent(currentScrollPos)
        menuIsOpen ? mobileMenuIsOpen = true : mobileMenuIsOpen = false    
    }

    function toggleDesktopMenu(clickedItem = null){
        menuItems.forEach((item) => { 
            if (item == clickedItem) {
                item.classList.add('is-toggled')
            } else {
                item.classList.remove('is-toggled') 
            }
        })
        // set margin on page wapper  
        // and restore scrolled position when you close menu
        setScrolledMarginContent(currentScrollPos)
        menuIsOpen ? desktopMenuIsOpen = true : desktopMenuIsOpen = false
    }

    function toggleMenuWhenResized(){
        // if mobile menu is open and window resized to desktop
        if (mobileMenuIsOpen && isDesktop.matches){
            toggleMenuSharedElements()
            toggleMobileMenu(true)
            menuIsOpen = false
        }
        // if desktop menu is open and window resized to mobile
        if (desktopMenuIsOpen && !isDesktop.matches){
            toggleMenuSharedElements()
            toggleDesktopMenu()
            menuIsOpen = false
        }
    }

    menuItems.forEach(item => {
        item.addEventListener('click', function(e){
            e.preventDefault()
            if (item.classList.contains('is-toggled')) {
                toggleMenuSharedElements()
                toggleDesktopMenu()
            } else if (desktopMenuIsOpen){
                toggleDesktopMenu(this)
            } else {
                toggleMenuSharedElements()
                toggleDesktopMenu(this)
            }
        })
    })
    
    menuBtn.addEventListener('click', function(){
        toggleMenuSharedElements()
        if (isDesktop.matches) {
            toggleDesktopMenu()
        } else {
            toggleMobileMenu()
        }
    })
  
    //close all accordion menu items
    function closeAllAccordionMenuItems(){
        accordionMenuItems.forEach(item => {
            item.parentElement.parentElement.classList.remove('is-toggled')
            item.parentElement.parentElement.setAttribute('aria-expanded', 'false')
        })
    }

    accordionMenuItems.forEach(button => {
        button.addEventListener('click', function(){
            // get <li>
            const clickedItem = this.parentElement.parentElement
            // get nesting of clicked item (from button)
            const nesting = this.getAttribute('data-toggle-menu-items')

            if (nesting == 0 && clickedItem.classList.contains('is-toggled')) {
                // if is first level and already opened, 
                // when clicked close all items
                closeAllAccordionMenuItems()
            } else {
                // when you click on item, close other items on same nesting level
                [...document.querySelectorAll(`[data-toggle-menu-items="${nesting}"]`)].forEach(i=>{if(this != i){i.parentElement.parentElement.classList.remove('is-toggled')}})
                // toggle clicked item
                clickedItem.classList.toggle('is-toggled')
            }
        })
    })

    /**
     * Back to top
     */
    document.getElementById('backToTop').addEventListener('click', function(){
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    })

    /**
     * Footer observer
     */
    //when footer is in viewport, restore logo position
    let footerObserver = new IntersectionObserver((entries) => { 
        
        entries.forEach(entry => {
            if(entry.isIntersecting){
                body.classList.add('footer-in-viewport')
            } else {
                body.classList.remove('footer-in-viewport')
            }
        })

    }, 
    {
        rootMargin: '0px'
    })
    footerObserver.observe(footer)

    /**
     * Window resize function callbacks
     */
    const resizeHandler = function(){
        // set vh
        set100vh()
        // get header height
        getHeaderHeight()
        // when resizing disable menu if toggled
        toggleMenuWhenResized()
    }
    window.addEventListener('resize', resizeHandler)

    /**
     * Keyboard related functions and events
     */
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ('key' in evt) {
            isEscape = (evt.key === 'Escape' || evt.key === 'Esc');
        } else {
            isEscape = (evt.keyCode === 27);
        }
        // if menu is open and press escape, toggle desktop or mobile menu
        // based on media query
        if (isEscape && menuIsOpen) {
            toggleMenuSharedElements()
            if (isDesktop.matches) {
                toggleDesktopMenu()
            } else {
                toggleMobileMenu()
            }
        }
    }

})