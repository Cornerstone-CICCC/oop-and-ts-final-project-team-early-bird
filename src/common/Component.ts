export class Component {
    props: any
    element: any

    constructor(props = {}) {
        this.props = props
        this.element = null
    }

    render() {
        throw new Error('Component should have a render() method!')
    }

    mount(container: any) {
        this.element = this.render()
        container.appendChild(this.element)
    }
}