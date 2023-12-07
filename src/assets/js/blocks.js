/**
 * Scripts for custom blocks and components
 */

window.addEventListener('load', (event) => {

    /**
     * Vars
     */
    // DOM elements
    const marquees = document.querySelectorAll('.block-marquee-posts-row')
    const cards = document.querySelectorAll('.card')
    const secondaryNav = document.querySelector('.secondary-nav')
    const secondaryNavTrigger = document.querySelector('.secondary-nav-trigger')
    const parallaxImages = document.querySelectorAll('[data-banner-scroll-image]')
    const teaseItems = document.querySelectorAll('.tease')

    /**
     * Marquees 
     */
    let marqueesCardWidth
    if (marquees.length > 0){
        marqueesCardWidth = window.getComputedStyle(marquees[0]).getPropertyValue('--marquee-card-width')
    }

    marquees.forEach(marquee => {

        const marqueeSpeed = Number(marquee.getAttribute('data-marquee-row-speed'))

        let marqueePos = 0
        let marqueeIntvl
    
        //get vars
        const items = marquee.getAttribute('data-marquee-row-items')
        const wrapper = marquee.querySelector('.block-marquee-posts-row__wrapper')

        //clone cards in marquee
        const cards = wrapper.querySelectorAll('.card')
        cards.forEach(card => {
            wrapper.appendChild(card.cloneNode(true))
        })

        //calculate wrapper width
        wrapper.style.width = `calc(${items*2}*${marqueesCardWidth})`

        marqueeIntvl = setInterval(() => {
            if (marqueePos > 50) {
                wrapper.style.transform = `translateX(0%)`    
                marqueePos = 0
            } else {
                wrapper.style.transform = `translateX(-${marqueePos}%)`
            }
            marqueePos = marqueePos+marqueeSpeed
        }, 0)

        marquee.addEventListener('mouseover', function(){
            clearInterval(marqueeIntvl)
        })

        marquee.addEventListener('mouseleave', function(){
            marqueeIntvl = setInterval(() => {
                if (marqueePos > 50) {
                    wrapper.style.transform = `translateX(0%)`    
                    marqueePos = 0
                } else {
                    wrapper.style.transform = `translateX(-${marqueePos}%)`
                }
                marqueePos = marqueePos+marqueeSpeed
            }, 0)    
        })

    })

    /**
     * Cards hover effect
     */
    cards.forEach(card => {
        const marqueeWrapper = card.closest('.block-marquee-posts-row')
        card.addEventListener('mouseenter', function(){
            this.classList.add('is-hovered')
            if (marqueeWrapper){
                marqueeWrapper.classList.add('is-hovered')
            }
        })
        card.addEventListener('mouseleave', function(){
            this.classList.remove('is-hovered')
            if (marqueeWrapper){
                marqueeWrapper.classList.remove('is-hovered')
            }
        })
    })

    /**
     * Homepage Hero Banner parallax effect
     */

    document.addEventListener('scroll', function(){
        const scrollPosition = window.scrollY
        parallaxImages.forEach(image => {

            const imageSpeed = image.getAttribute('data-banner-scroll-image-parallax-speed')
            const imagePos = scrollPosition * imageSpeed
            image.style.transform = `translateY(-${imagePos}px)`

            scrollBannerObserver.observe(image)

        })
    })

    
    let scrollBannerObserver = new IntersectionObserver((entries) => { 
        
        entries.forEach(entry => {
                        
            if(entry.isIntersecting && (entry.target.getBoundingClientRect().top > 0)){
                entry.target.classList.add('is-visible')
                entry.target.style.opacity = entry.intersectionRatio
            }

        })

    }, 
    {
        rootMargin: "0px 0px 0px 0px",
        threshold: [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1]
    })

    /**
     * Tease height transition
     */
    function updateTeaseHeight(tease){
        const teaseHeight = tease.clientHeight
        const teaseImg = tease.querySelector('.tease__img')
        const teaseText = tease.querySelector('.tease__main')
        const teaseTextHeight = teaseText.clientHeight
        teaseImg.style.height = `${teaseHeight-teaseTextHeight}px`
        teaseText.style.marginTop = `${teaseHeight-teaseTextHeight}px`
    }

    teaseItems.forEach(tease => {
        updateTeaseHeight(tease)        
    })

    /**
     * Accordion
     */
    const accordions = document.querySelectorAll('[data-accordion]')
    accordions.forEach(accordion => {
        const title = accordion.querySelector('[data-accordion-title]')
        const content = accordion.querySelector('[data-accordion-content]')
        title.addEventListener('click', function(){
            [...accordions].forEach(item => { item.classList.remove('is-toggled'); item.querySelector('[data-accordion-content]').style.display = 'none'})
            accordion.classList.toggle('is-toggled')
            content.style.display = content.style.display == 'none' ? 'block' : 'none';
        })
    })

    /**
     * Secondary Nav
     */
    // Get secondary nav height
    function getSecondaryNavHeight(){
        document.documentElement.style.setProperty("--secondary-nav-height", `${secondaryNav.clientHeight}px`)
    }

    if(secondaryNav !== null) getSecondaryNavHeight()

    let secondaryNavObserver = new IntersectionObserver((entries) => { 
        entries.forEach(entry => {
            if(!entry.isIntersecting){
                secondaryNav.classList.add('is-visible')
            } else {
                secondaryNav.classList.remove('is-visible')
            }
        })
    }, 
    {
        threshold: 1,
        rootMargin: '-1px 0px 0px 0px'
    })

    if(secondaryNav !== null) secondaryNavObserver.observe(secondaryNavTrigger)

    function getSecondaryNavButtonWidth(){
        const secondaryNavButtonWidth = secondaryNav.querySelector('.secondary-nav__btn').clientWidth
        secondaryNav.style.setProperty("--secondary-nav-button-width", `${secondaryNavButtonWidth}px`)
    }
    if(secondaryNav !== null) getSecondaryNavButtonWidth()

    if(secondaryNav !== null){
        window.addEventListener('scroll', () => {
            currentScrollPos = window.scrollY
            if (prevScrollPos > 0 && prevScrollPos < currentScrollPos ) {
                secondaryNav.classList.remove('is-stacked')
            } else if (prevScrollPos >= currentScrollPos) {
                secondaryNav.classList.add('is-stacked')
            }
        })
    }

    /**
     * Window resize function callbacks
     */
    const resizeHandler = function(){

        // if secondary nav exists update height and buttons width
        if(secondaryNav !== null) getSecondaryNavHeight()
        if(secondaryNav !== null) getSecondaryNavButtonWidth()

        //resize tease posts
        teaseItems.forEach(tease => {
            updateTeaseHeight(tease)        
        })
    }

    window.addEventListener('resize', resizeHandler)

})