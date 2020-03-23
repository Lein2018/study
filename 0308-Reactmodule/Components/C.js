const ExtendComponent = (WrappedComponent) => {
    return class extends WrappedComponent {
        render() {
            console.log(WrappedComponent);
            return super.render();
        }
    }
}

export default ExtendComponent;
