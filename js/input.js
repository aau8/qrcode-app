class Input {

    constructor(elem) {
        this.elem = elem
    }

    // get console() {
    //     console.log(this.$el)
    // }

    get value() {
        return this.elem.value
    }

    set value(value) {
        console.log(value)
        if (value === undefined) value = this.elem.value
        this.elem.setAttribute('value', value)
    }

    get min() {
        return this.elem.getAttribute('min')
    }

    setMin(value) {
        this.elem.setAttribute('min', value)
    }

    get max() {
        return this.elem.getAttribute('max')
    }

    setMax(value) {
        this.elem.setAttribute('max', value)
    }

    listener(event) {
        this.elem.addEventListener(event, () => {
            return this.elem.value
        })
    }

}


// const input = new Input('#pos-x')
// console.log(input.listener('input'))

const inputElems = findAll('input')
for (let i = 0; i < inputElems.length; i++) {
    const input = inputElems[i];
    
    input.addEventListener('input', e => {

        if (input.classList.contains('input-num')) {
            console.log(input.value, 1)
        }
    })

    input.addEventListener('change', e => {

    })
}

