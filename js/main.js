
// Служебные переменные
const d = document;
const body = d.querySelector('body');

// Служебные функции

function find(selector) {
	return d.querySelector(selector)
}

function findAll(selectors) {
	return d.querySelectorAll(selectors)
}

// Удаляет у всех элементов items класс itemClass
function removeAll(items,itemClass) {   
    if (typeof items == 'string') {
      items = document.querySelectorAll(items)
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      item.classList.remove(itemClass)
    }
}

function bodyLock(con) {
    if (con === true) {
        body.classList.add('_lock');
    } else if (con === false) {
        body.classList.remove('_lock');
    } else if (con === undefined) {
		if (!body.classList.contains('_lock')) {
			body.classList.add('_lock');
		}
		else {
			body.classList.remove('_lock')
		}
	} else {
		console.error('Неопределенный аргумент у функции bodyLock()')
	}
}

// Функции при клике по странице
document.addEventListener('click', (e) => {
    selectFrameClose(e)
})

// Выбор из раскрывающегося списка
selectFrame()
function selectFrame() {
    const selectElems = findAll('.frame-select')

    for (let i = 0; i < selectElems.length; i++) {
        const select = selectElems[i];
        const sHeader = select.querySelector('.frame-select__header')
        const sHeaderTitle = sHeader.querySelector('.frame-select__header-text span')
        const sBody = select.querySelector('.frame-select__body')
        const itemElems = sBody.querySelectorAll('.frame-select__item')
    
        // Открытие селекта
        sHeader.addEventListener('click', () => {
            select.classList.toggle('_open')
        })
    
        // Выбор устройств
        for (let i = 0; i < itemElems.length; i++) {
            const item = itemElems[i];
            
            item.addEventListener('click', () => {
                const title = item.querySelector('.frame-select__item-title')
    
                removeAll(itemElems, '_selected')
                item.classList.add('_selected')
                sHeaderTitle.innerText = title.innerText
    
                select.classList.remove('_open')
            })
        }
    }
}

// Закрытие селекта
function selectFrameClose(e) {
    const target = e.target
        
    if (!target.classList.contains('.frame-select') && !target.closest('.frame-select')) {
        let select = find('.frame-select._open')

        if (select) {
            select.classList.remove('_open')
        }
    }
}

// Переключение сайдбаров с настройками
changeSidebarWithSettings()
function changeSidebarWithSettings() {
    const btnElems = findAll('[data-open-sidebar]')
    const sidebarElems = findAll('.sidebar')

    for (let i = 0; i < btnElems.length; i++) {
        const btn = btnElems[i];
        
        btn.addEventListener('click', () => {
            const dataAttr = btn.dataset.openSidebar
            const sidebar = find(`#${dataAttr}`)

            removeAll(btnElems, '_checked')
            removeAll(sidebarElems, '_show')

            btn.classList.add('_checked')
            sidebar.classList.add('_show')

            setFrame()
        })
    }
}

// Ширина фрейма
setFrame()
window.addEventListener('resize', setFrame)
function setFrame() {
    const frame = find('.frame')
    const sidebar = find('.sidebar._show')

    if (sidebar) frame.style.width = document.documentElement.clientWidth - sidebar.clientWidth + 'px'
}

// Мобильное меню
menu()
function menu() {
	const burger = find('.burger')
	const menu = find('.menu');

	burger.addEventListener('click', (e) => {
		burger.classList.toggle('burger_close')
		menu.classList.toggle('_show')
	})
}



// ====================================================================


const wrapper = document.querySelector('.generated-img')
const canvas = document.querySelector('#canvas')
const frame = document.querySelector('.frame-edit')
const qrCode = document.querySelector('#qrcode')
canvas.width = wrapper.offsetWidth
canvas.height = wrapper.offsetHeight

// Определение расстояния между элементом и верхней границей страницы
function offset(elem) {
    var rect = elem.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

// Генератор svg в url
function SVGToURL(value) {
    const notSpace = value.replace(/>\s+</g, '><');
    const notDoubleQuotes = notSpace.replace(/"/g, '\'');
    const notSharp = notDoubleQuotes.replace(/#/g, '%23');
    const notAngleLeft = notSharp.replace(/</g, '%3C');
    const notAngleRight = notAngleLeft.replace(/>/g, '%3E');
    const url = 'data:image/svg+xml,' + notAngleRight;

    return url;
}

// Передвижение qr-кода
dragqrCode()
function dragqrCode() {
    qrCode.onmousedown = function (event) {
        let shiftX = Math.trunc(event.clientX) - Math.trunc(qrCode.getBoundingClientRect().left);
        let shiftY = Math.trunc(event.clientY) - Math.trunc(qrCode.getBoundingClientRect().top);

        function moveAt(pageX, pageY) {
            const frameLeft = Math.trunc(offset(frame).left)
            const frameTop = Math.trunc(offset(frame).top)
            const frameHeight = frame.offsetHeight
            const qrCodeHeight = qrCode.offsetHeight

            let qrCodePosX = pageX - shiftX - frameLeft
            let qrCodePosY = pageY - shiftY - frameTop

            let minPosX = 0
            let minPosY = 0
            let maxPosX = frame.offsetWidth - qrCode.offsetWidth
            let maxPosY = frame.offsetHeight - qrCode.offsetHeight

            if (qrCodePosX <= minPosX) qrCodePosX = minPosX
            if (qrCodePosY <= minPosY) qrCodePosY = minPosY
            if (qrCodePosX >= maxPosX) qrCodePosX = maxPosX
            if (qrCodePosY >= maxPosY) qrCodePosY = maxPosY

            // Переводим значение позиции для указания его в свойстве bottom
            y = (frameHeight / 2 - qrCodeHeight / 2)
            qrCodePosY = 2*y - qrCodePosY

            qrCode.style.left = qrCodePosX + 'px';
            qrCode.style.bottom = qrCodePosY + 'px';

            setChangesFromElem('#pos-x', qrCodePosX)
            setChangesFromElem('#pos-y', qrCodePosY)
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        qrCode.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            qrCode.onmouseup = null;
        };
        document.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            qrCode.onmouseup = null;
        };
    };

    qrCode.ondragstart = function () {
        return false;
    };
}

// Показать/убрать элемент
toggleElem()
function toggleElem() {
    const checkboxElems = findAll('.qrcode-checkbox__input')

    for (let i = 0; i < checkboxElems.length; i++) {
        const checkbox = checkboxElems[i];
        const dataAttr = checkbox.dataset.idElemToggle
        const elem = find(`#${dataAttr}`)
    }
}

// Изменение позиции qr-кода при клике по кнопкам позиционирования
changePosqrCodeWithButtonsPos()
function changePosqrCodeWithButtonsPos() {
    const left = document.querySelector('#align-left')
    const right = document.querySelector('#align-right')
    const top = document.querySelector('#align-top')
    const bottom = document.querySelector('#align-bottom')
    const hCenter = document.querySelector('#align-horizontal-center')
    const vCenter = document.querySelector('#align-vertical-center')

    left.addEventListener('click', () => {
        const leftValue = '0px'
        qrCode.style.left = leftValue
        setChangesFromElem('#pos-x', leftValue)
    })

    right.addEventListener('click', () => {
        const rightValue = frame.offsetWidth - qrCode.offsetWidth + 'px'
        qrCode.style.left = rightValue
        setChangesFromElem('#pos-x', rightValue)
    })

    vCenter.addEventListener('click', () => {
        const vCenterValue = (frame.offsetWidth - qrCode.offsetWidth) / 2 + 'px'
        qrCode.style.left = vCenterValue
        setChangesFromElem('#pos-x', vCenterValue)
    })

    top.addEventListener('click', () => {
        const topValue = '0px'
        qrCode.style.top = topValue
        setChangesFromElem('#pos-y', topValue)
    })

    bottom.addEventListener('click', () => {
        const bottomValue = frame.offsetHeight - qrCode.offsetHeight + 'px'
        qrCode.style.top = bottomValue
        setChangesFromElem('#pos-y', bottomValue)
    })

    hCenter.addEventListener('click', () => {
        const hCenterValue = (frame.offsetHeight - qrCode.offsetHeight) / 2 + 'px'
        qrCode.style.top = hCenterValue
        setChangesFromElem('#pos-y', hCenterValue)
    })
}

// Фрейм и его размеры
// const frame = document.querySelector('.frame-edit')
// const frameWidth = frame.offsetWidth
// const frameHeight = frame.offsetHeight

// window.addEventListener('resize', () => {
//     positionqrCode()
//     sizeImageBg()
//     positionImageBg()
// })

stylesqrCodeBg()
function stylesqrCodeBg() {
    const qrCodeBg = document.querySelector('#qrcode')
    const defaultCSS = {
        'background': 'rgba(255, 255, 255, 0.6)',
        // 'backdrop-filter': [
        //     'blur(4px)'
        // ],
        'width': '100px',
        'height': '100px',
        'padding': '16px',
        'border-radius': '10px'
    }
    let customStyle = []

    if (customStyle.length == 0) {
        customStyle = defaultCSS
    }

    Object.keys(customStyle).forEach(function(key) {
        qrCodeBg.style[key] = customStyle[key].toString().replace('),', ') ')
    })

    setChangesFromElem('#qrcode-size', customStyle.width)
}

positionqrCode()
function positionqrCode() {
    const frameWidth = frame.offsetWidth
    const frameHeight = frame.offsetHeight
    const qrCode = document.querySelector('#qrcode')
    
    qrCode.style.position = 'absolute'
    qrCode.style.zIndex = '1'

    const qrCodeLeft = (frameWidth / 2) - (qrCode.offsetWidth / 2) + 'px'
    const qrCodeTop = 50 + 'px'

    // Задаем значения для свойств left и top
    qrCode.style.left = qrCodeLeft
    qrCode.style.bottom = qrCodeTop
    // Заносим позицию qr-кода в инпуты #pos-x и #pos-y
    setChangesFromElem('#pos-x', qrCodeLeft)
    setChangesFromElem('#pos-y', qrCodeTop)
}

// Загрузка выбранного в прошлом изображения
firstDownloadImageBg()
function firstDownloadImageBg() {
    if (localStorage.getItem('image_bg')) {
        const imageBg = document.querySelector('#image-bg')
        imageBg.src = localStorage.getItem('image_bg')
    }
}

// Загрузка нового фонового изображения
downloadImageBg()
function downloadImageBg() {
    const input = document.querySelector('#download-bg')
    const imageBg = document.querySelector('#image-bg')

    input.addEventListener('change', () => {

        if (input.files && input.files[0]) {
            const reader = new FileReader()
            reader.onload = function(e) {
                imageBg.src = e.target.result
                localStorage.setItem('image_bg', e.target.result)  
                console.log(e.target.result)
            }
    
            reader.readAsDataURL(input.files[0])
        }
    })
}

// Выбор из галлереи нового фонового изображения 
setImageBg()
function setImageBg() {
    const qrCodeBg = document.querySelector('#image-bg')
    const galleryBgElems = document.querySelectorAll('.gallery-card')

    for (galleryBg of galleryBgElems) {
        const img = galleryBg.querySelector('img')
        const setBg = galleryBg.querySelector('.set-bg')

        setBg.addEventListener('click', () => {
            qrCodeBg.src = img.src
            localStorage.setItem('image_bg', img.src)
            positionImageBg()
        })
    }
}

// Позиция фонового изображения
positionImageBg()
function positionImageBg() {
    // Размер фона
    const frameWidth = frame.offsetWidth
    const frameHeight = frame.offsetHeight

    const bg = document.querySelector('#image-bg')
    const bgWidth = bg.naturalWidth
    const bgHeight = bg.naturalHeight

    const bgWidthDiff = bgWidth / frameWidth
    const bgHeightDiff = bgHeight / frameHeight

    let newBgWidth = bgWidth / bgWidthDiff
    let newBgHeight = bgHeight / bgWidthDiff

    if (newBgHeight < frameHeight) {
        newBgWidth = bgWidth / bgHeightDiff
        newBgHeight = bgHeight / bgHeightDiff
    }

    bg.style.width = newBgWidth + 'px'
    bg.style.height = newBgHeight + 'px'

    // Позиционирование фона
    const bgImage = document.querySelector('#image-bg')

    bgImage.style.position = 'absolute'
    bgImage.style.left = (frameWidth / 2) - (bgImage.offsetWidth / 2) + 'px'
    bgImage.style.bottom = (frameHeight / 2) - (bgImage.offsetHeight / 2) + 'px'
}

// Отрисовка фона для скачивания
createBgWithqrCode()
function createBgWithqrCode() {
    const imageBg = frame.querySelector('#image-bg')
    const qrCodeIcon = frame.querySelector('#qrcode-icon')
    const button = document.querySelector('#create-bg')
    const qrCode = frame.querySelector('#qrcode')
    const incr = 2
    
    button.addEventListener('click', () => {
        const qrCodeLeft = parseInt(qrCode.style.left)
        const qrCodeTop = parseInt(qrCode.style.top)
        const qrCodeWidth = qrCode.clientWidth
        const qrCodeHeight = qrCode.clientHeight

        const fileExt = button.dataset.ext
        const ctx = canvas.getContext('2d')

        // Отрисовка фонового изображения на canvas
        ctxImageBg = new Image()
        ctxImageBg.src = imageBg.src
        ctxImageBg.onload = function () {
            ctx.drawImage(ctxImageBg, (frame.clientWidth - frame.clientWidth / 2 - parseInt(imageBg.style.width) / 2) * incr, 0, parseInt(imageBg.style.width) * incr, parseInt(imageBg.style.height) * incr)
            // Отрисовка фона qr-кода
            ctx.strokeStyle = "rgba(255, 255, 255, 0)";
            ctx.fillStyle = qrCode.style.background;
            
            roundRect(ctx, qrCodeLeft * incr, qrCodeTop * incr, qrCodeWidth * incr, qrCodeHeight * incr, parseInt(qrCode.style.borderRadius), true)

            // Отрисовка qr-кода на canvas
            ctxqrCode = new Image()
            ctxqrCode.src = SVGToURL(document.querySelector('#qrcode-icon').innerHTML)
            ctxqrCode.onload = function () {
                ctx.drawImage(ctxqrCode, (qrCodeLeft + (qrCodeWidth / 2) - (qrCodeIcon.clientWidth / 2)) * incr, (qrCodeTop + (qrCodeHeight / 2) - (qrCodeIcon.clientHeight / 2)) * incr, qrCodeIcon.clientWidth * incr, qrCodeIcon.clientHeight * incr)
                const qrCodeContainer = document.querySelector('#qrcode')
                const qrCodeBgPadding = qrCodeContainer.style.padding


                // Скачивание canvas
                const canvasUpdated = document.querySelector('#canvas')
                let dataURL = canvasUpdated.toDataURL(`image/${fileExt}`)
                let link = document.createElement('a')
                link.href = dataURL
                link.target = '_blank'
                link.download = `Фон_на_экран_блокировки_с_QR_кодом.${fileExt}`
                link.click()
            }
        }    
    })
    
    // Отрисовка квадрата с закругленными углами
    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == "undefined" ) {
          stroke = true;
        }
        if (typeof radius === "undefined") {
          radius = 5;
        }
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (stroke) {
          ctx.stroke();
        }
        if (fill) {
          ctx.fill();
        }        
    }
}


// Изменение позиции qr-кода при изменении значения инпутов с помощью стрелок "верх" и "вниз"
changeValueInputNumWithArrow()
function changeValueInputNumWithArrow() {
    const inputNumElems = document.querySelectorAll('.input-num')
    const inputElems = document.querySelectorAll('input')

    for (let i = 0; i < inputNumElems.length; i++) {
        const input = inputNumElems[i];

        input.addEventListener('keydown', function(e) {

            if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
                e.preventDefault()

                const minValue = parseInt(input.getAttribute('min'))
                const maxValue = parseInt(input.getAttribute('max'))
                const value = parseInt(input.value)

                let incr = 1
                if (e.shiftKey) incr = 10
    
                if (e.code === 'ArrowUp') {
                    const sumValue = value + incr
                    
                    if (sumValue >= maxValue) {
                        input.value = maxValue
                        console.log('maxValue')
                    }
                    else {
                        input.value = sumValue
                    }
                    
                    if (isNaN(value)) input.value = parseInt(input.getAttribute('value')) + 1
                }

                if (e.code === 'ArrowDown') {
                    const sumValue = value - incr
                    
                    if (sumValue <= minValue) {
                        input.value = minValue
                        console.log('minValue')
                    }
                    else {
                        input.value = sumValue
                    }
                    
                    if (isNaN(value)) input.value = parseInt(input.getAttribute('value')) - 1
                }
                this.select()
                setValueInput([input])
                changedValueInput(input)
            }
        })

        input.addEventListener('change', e => {
            const minValue = parseInt(input.getAttribute('min'))
            const maxValue = parseInt(input.getAttribute('max'))
            const isNum    = input.value.match(/[^0-9]/)
            let value      = parseInt(input.value)

            if (value > maxValue) value = maxValue
            if (value < minValue) value = minValue
            if (isNum)            value = input.getAttribute('value')
            if (isNaN(value))     value = input.getAttribute('value')

            input.value = value
            setValueInput([input])

            changedValueInput(input)
        })


        input.addEventListener('input', e => {

        })

        function changedValueInput(input) {
            setChangesFromInput(input, '#pos-x', '#qrcode', { left: input.value + 'px' })
            setChangesFromInput(input, '#pos-y', '#qrcode', { bottom: input.value + 'px' })
            setChangesFromInput(input, '#qrcode-icon-opacity', '#qrcode-icon path', { opacity: input.value/100 })
            setChangesFromInput(input, '#qrcode-bg-opacity', '#qrcode', { opacity: input.value/100 })
            setChangesFromInput(input, '#qrcode-bg-border-radius', '#qrcode', { 'border-radius': input.value + 'px'})
        }
    }

    for (let i = 0; i < inputElems.length; i++) {
        const input = inputElems[i];
        
        input.addEventListener('input', e => {
            setChangesFromInput(input, '#qrcode-color-select', '#qrcode-icon path', { 'fill': input.value}, setChangesFromElem('#qrcode-color-write', input.value))
        
            setValueInput([input])
        })

        input.addEventListener('change', e => {
            setChangesFromInput(input, '#qrcode-color-write', '#qrcode-icon path', { 'fill': input.value})

        })
    }
}

// function inputConsole(input, condition) {
//     console.log(input)
// }


function setValueInput(selectors) {
    for (let i = 0; i < selectors.length; i++) {
        const input = selectors[i];
        if (!isNaN(input.value)) input.setAttribute('value', input.value)
    }
}

// Установка стилей елементам с помощью инпутов
function setChangesFromInput(input, condition, selector, styles, callback) {
    if (input.getAttribute('id') === condition.replace('#', '') || input.classList.contains(condition)) {
        const managedElems = document.querySelectorAll(selector)

        for (let i = 0; i < managedElems.length; i++) {
            const managedElem = managedElems[i];
            
            for (const [key, value] of Object.entries(styles)) {
                managedElem.style[key] = value.toString().replace('),', ') ')
            }
        }

        if (callback != undefined) callback.apply(this, input, condition, selector, styles)
    }
}

// Установка значения инпутам
function setChangesFromElem(manageInput, value) {
    manageInput = document.querySelector(manageInput)

    if (manageInput.classList.contains('input-num')) {
        manageInput.value = parseInt(value)
    }
    else {
        manageInput.value = value
    }

    manageInput.setAttribute('value', value)
}

// parametersQRCode()
function parametersQRCode() {
    // Изменение цвета qr-кода
    changeColorQRCode()
    function changeColorQRCode() {
        const qrCodeIcon = document.querySelector('#qrcode-icon')
        const pathElems = qrCodeIcon.querySelectorAll('path')
        const inputColor = document.querySelector('#qrcode-color-select')

        inputColor.addEventListener('input', () => {
            const value = inputColor.value

            for (let i = 0; i < pathElems.length; i++) {
                const path = pathElems[i];

                path.setAttribute('fill', value)
            }
        })
    }

    // Изменение размера qr-кода
    // changeSizeQRCode()
    // function changeSizeQRCode() {
    //     const qrCodeIcon = document.querySelector('#qrcode-icon')
    //     const inputSize = document.querySelector('#qrcode-size')

    //     inputSize.addEventListener('input', () => {
    //         const value = inputSize.value
    //     })
    // }
}