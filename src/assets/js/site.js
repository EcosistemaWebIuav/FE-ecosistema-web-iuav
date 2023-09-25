window.addEventListener('load', (event) => {

    const body = document.body
    const overlay = document.getElementById('overlay')
    var pristine

    /**
     * Set custom message for input email validation
     */
    Pristine.addMessages('en', {
        'email': "Questo campo richiede un'email valida"
    })    

    const form = document.getElementById('request-form');

    /**
     * Check if iOS and set --vh var
     */
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    if (isIOS && window.matchMedia("(max-width: 1024px)").matches) {
        document.documentElement.classList.add('is-ios')
        set100vhVar()
    }
    
    function set100vhVar() {
        // If less than most tablets, set CSS var to window height.
        let value = '100vh'

        // If window size is iPad or smaller, then use JS to set screen height.
        if (window.innerWidth && window.innerWidth <= 1024) {
            value = `${window.innerHeight}px`
        }
        document.documentElement.style.setProperty("--vh", value)
    }

    /**
     * Select correct radio button when clicked on card
     */

    const certificateTypeNameInput = document.getElementById('certificate-type-name')

    const reqTypes = document.querySelectorAll('[data-form-request-type]')
    reqTypes.forEach(item => {
        item.addEventListener('click', function(){
            const radio = this.querySelector('input[type="radio"]')
            const radioValue = radio.id
            certificateTypeNameInput.value = radioValue
            radio.checked = true
        })
    })

    /**
     * Navigate through form steps
     */
    const formNavigationButtons = document.querySelectorAll('[data-form-step-show]')
    formNavigationButtons.forEach(button => {
        button.addEventListener('click', function(){
            const step = this.getAttribute('data-form-step-show')
            this.parentElement.parentElement.style.display = 'none'
            document.querySelector(`[data-form-step="${step}"]`).style.display = 'block'
        })
    })

    /**
     * Show correct summary and file upload fields on form step 2
     */
    const reqSelected = document.querySelector('[data-form-request-selected]')

    if (typeof(reqSelected) != 'undefined' && reqSelected != null){

        reqSelected.addEventListener('click', function(){
    
            const selection = document.querySelector('[name="certificate-type"]:checked').id
            /* Show right summary */
            const reqs = document.querySelectorAll('.form-card-step-summary__card')
            reqs.forEach(req => {
                if (req.id == `summary-${selection}`) {
                    req.style.display = 'block'
                } else {
                    req.style.display = 'none'
                }
            })
    
            /* Show right fields */
            const reqFields = document.querySelectorAll('.form-card-step-files')
            reqFields.forEach(item => {
                if (item.id == `file-upload-${selection}`) {
                    item.style.display = 'block'
                    const itemInputs = item.querySelectorAll('input[type="file"]')
                    itemInputs.forEach(itemInput => {
                        itemInput.required = true
                    })
                } else {
                    item.style.display = 'none'
                    const itemInputs = item.querySelectorAll('input[type="file"]')
                    itemInputs.forEach(itemInput => {
                        itemInput.required = false
                        // reset input file
                        itemInput.value = ''
                        itemInput.closest('.drop-area').classList.remove('has-file')
                    })
                }
            })
    
            pristine = new Pristine(form, {
                classTo: 'form-input-row',
                errorClass: 'has-error',
                successClass: 'has-success',
                // class of the parent element where error text element is appended
                errorTextParent: 'form-input-row',
                // type of element to create for the error text
                errorTextTag: 'span',
                // class of the error text element
                errorTextClass: 'text-help'
            })
    
        })
    }

    /**
     * Reset & Destroy Pristine when going back to step 1 of the form
     */
    const showFormStep1 = document.querySelector('[data-form-step-show="1"]')
    if (typeof(showFormStep1) != 'undefined' && showFormStep1 != null){
        showFormStep1.addEventListener('click', function(){
            pristine.reset()
            pristine.destroy()
        })
    }

    /**
     * File upload
     */

    //handle normal inputs
    const inputFiles = document.querySelectorAll('input[type="file"]')
    inputFiles.forEach(input => {
        input.addEventListener('change', function(e){
            
            //select droparea
            const dropArea = input.closest('.drop-area')

            const fileBox = dropArea.querySelector('.file')

            //set vars
            const fileBoxName = fileBox.querySelector('.file__name')
            const fileBoxSize = fileBox.querySelector('.file__size')
            const fileName = input.files[0].name;
            const fileSize = formatBytes(input.files[0].size)
            const fileType = input.files[0].type
    
            const allowedType = checkFileType(fileType)
            const allowedSize = checkFileSize(input.files[0].size)
    
            if (allowedType && allowedSize) {   

                // set filename and file size    
                fileBoxName.textContent = fileName
                fileBoxSize.textContent = fileSize
              
                //set drop area with file
                dropArea.classList.add('has-file')
       
                //clear error messages
                dropArea.classList.remove('has-file-error')
                
            } else {

                //clear input file
                input.value = ''
                
                //add error class to droparea
                dropArea.classList.add('has-file-error')

                if (!allowedType && !allowedSize){
                    dropArea.querySelector('.drop-area__error').textContent = `Il file ${fileName} non è consentito. Sono ammessi solo i file con queste estensioni: jpg, pdf. Sono ammessi solo file inferiori a 5MB.`
                    return
                }
                if (!allowedType){
                    dropArea.querySelector('.drop-area__error').textContent = `Il file ${fileName} non è consentito. Sono ammessi solo i file con queste estensioni: jpg, pdf.`
                }
                if (!allowedSize){
                    dropArea.querySelector('.drop-area__error').textContent = `Il file ${fileName} non è consentito. Sono ammessi solo file inferiori a 5MB.`
                }
            }

        }) 
    })


    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'
    
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
    
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    function checkFileType(fileType){
        //allowed filetypes
        const allowedExtensions = ["image/jpg", "image/jpeg", "application/pdf"]

        if (allowedExtensions.includes(fileType)) {
            return true
        }
        return false

    }

    function checkFileSize(fileSize){

        const formattedFileSize = fileSize / 1024 / 1024

        //under 5MB
        if (formattedFileSize <= 5 ) {
            return true
        }

        return false

    }

    const dropAreas = document.querySelectorAll('.drop-area')

    function preventDefaults (e) {
        e.preventDefault()
        e.stopPropagation()
    }

    function highlight(e, dropArea) {
        dropArea.classList.add('highlight')
    }

    function unhighlight(e, dropArea) {
        dropArea.classList.remove('highlight')
    }

    function handleDrop(e, dropArea){
        let dt = e.dataTransfer
        let files = dt.files
        
        //select DOM
        const inputFile = dropArea.querySelector('input[type="file"]')
        const fileBox = dropArea.querySelector('.file')

        //set vars
        const fileBoxName = fileBox.querySelector('.file__name')
        const fileBoxSize = fileBox.querySelector('.file__size')
        const fileName = files[0].name
        const fileSize = formatBytes(files[0].size)
        const fileType = files[0].type

        const allowedType = checkFileType(fileType)
        const allowedSize = checkFileSize(files[0].size)

        if (allowedType && allowedSize) {   

            // set filename and file size    
            fileBoxName.textContent = fileName
            fileBoxSize.textContent = fileSize
          
            //set drop area with file
            dropArea.classList.add('has-file')

            //set file to input file
            inputFile.files = files

            //clear error messages
            dropArea.classList.remove('has-file-error')
            
        } else {
            dropArea.classList.add('has-file-error')
            if (!allowedType && !allowedSize){
                dropArea.querySelector('.drop-area__error').textContent = `Il file ${fileName} non è consentito. Sono ammessi solo i file con queste estensioni: jpg, pdf. Sono ammessi solo file inferiori a 5MB.`
                return
            }
            if (!allowedType){
                dropArea.querySelector('.drop-area__error').textContent = `Il file ${fileName} non è consentito. Sono ammessi solo i file con queste estensioni: jpg, pdf.`
            }
            if (!allowedSize){
                dropArea.querySelector('.drop-area__error').textContent = `Il file ${fileName} non è consentito. Sono ammessi solo file inferiori a 5MB.`
            }
        }        
      
    }

    dropAreas.forEach(dropArea => {
        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false)
        })
        ;['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, function(e){
                highlight(e, dropArea)
            }, false)
        })          
        ;['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, function(e){
                unhighlight(e, dropArea)
            }, false)
        })
        dropArea.addEventListener('drop', function(e){
            handleDrop(e, dropArea)
        }, false)
    })

    /**
     * Remove file
     */
    const removeFileInputBtn = document.querySelectorAll('[data-file-remove]')
    removeFileInputBtn.forEach(button => {
        button.addEventListener('click', function(e){
            const dropArea = button.closest('.drop-area')
            const fileInput = dropArea.querySelector('input[type="file"]')
            fileInput.value = ''
            dropArea.classList.remove('has-file')
        })  
    })

    /**
     * Form validation
     */
    if (typeof(form) != 'undefined' && form != null){
        form.addEventListener('submit', function (e) {
            e.preventDefault()
            overlay.classList.add('is-active')
            var valid = pristine.validate(
                document.querySelectorAll('.input-required')
            )
            if (valid) {
                form.submit()
            } else {
                overlay.classList.remove('is-active')
            }
        })
    }

    /**
     * Swiper
     */
    const carouselBar = document.querySelector('.carousel-bar span')
    const carouselTime = 6000

    const swiperText = new Swiper('.swiper-text', {
        slidesPerView: 1,
        allowTouchMove: false,
        loop: true,
        autoplay: {
            delay: carouselTime
        },
        on: {
            autoplayTimeLeft(s, time, progress) {
                let width = carouselTime-time
                width = width/1000*(100/(carouselTime/1000))
                carouselBar.style.width = `${width}%`
            }
        }
    })

    const swiperVideo = new Swiper('.swiper-video', {
        slidesPerView: 1,
        allowTouchMove: false,
        loop: true,
        autoplay: {
            delay: carouselTime
        },
        on: {
            'init': function (swiper) {
                const currentSlide = this.slides[swiper.activeIndex]
                const currentVideos = currentSlide.querySelectorAll('video')
                currentVideos.forEach(currentVideo => {
                    currentVideo.play()
                })        
            }
        }
    })
    
    swiperVideo.on('slideChange', function (swiper) {
        const currentSlide = this.slides[swiper.activeIndex]
        const currentVideos = currentSlide.querySelectorAll('video')
        currentVideos.forEach(currentVideo => {
            currentVideo.play()
        })
    })
      

})