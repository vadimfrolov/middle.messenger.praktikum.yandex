import { ConsturctEvents } from '../framework/block'
import { Validate } from '../framework/validator'

export function setErrorAttributes(
    elem: HTMLElement,
    text: string,
    errorClassName: string
): void {
    const wrapper = elem.parentElement as HTMLLIElement
    wrapper.setAttribute('data-error-text', text)
    wrapper.classList.add(errorClassName)
}

export function removeErrorAttributes(
    elem: HTMLElement,
    errorClassName: string
) {
    const wrapper = elem.parentElement as HTMLLIElement
    wrapper.removeAttribute('data-error-text')
    wrapper.classList.remove(errorClassName)
}

export function getDefaultListenersForValidation(
    validator: Validate,
    selectorField: string,
    errorClassName: string
): ConsturctEvents {
    return [
        {
            selector: selectorField,
            eventName: 'blur',
            listener: (event: Event) => {
                const input = event.target as HTMLInputElement
                const result = validator.test(input.name, input.value)
                if (result !== true) {
                    setErrorAttributes(input, result.join(' ,'), errorClassName)
                }
            },
        },
        {
            selector: selectorField,
            eventName: 'focus',
            listener: (event: Event) => {
                const input = event.target as HTMLInputElement
                if (input.parentElement?.classList.contains(errorClassName)) {
                    removeErrorAttributes(input, errorClassName)
                }
            },
        },
    ]
}

export function getListenerForFormSubmit(
    validator: Validate,
    selectorField: string,
    errorClassName: string
) {
    return {
        selector: selectorField,
        eventName: 'submit',
        listener: (event: Event) => {
            event.preventDefault()
            const form = event.target as HTMLFormElement
            console.log(form, 'form')
            const fields = form.querySelectorAll('[data-field]')
            let isValid = true
            Array.from(fields).forEach((field: HTMLInputElement) => {
                const result = validator.test(field.name, field.value)
                if (result === true) {
                    return
                }
                if (isValid) {
                    isValid = false
                }
                setErrorAttributes(field, result.join(' ,'), errorClassName)
            })
            if (!isValid) {
                return
            }
            const formData = new FormData(form)
            const data = Array.from(formData.entries()).reduce<{
                [key: string]: string
            }>((acc, [key, value]) => {
                acc[key] = value.toString()
                return acc
            }, {})
            console.log(data)
            if (form.dataset.redirectUrl) {
                window.location.pathname = form.dataset.redirectUrl
            }
        },
    }
}
