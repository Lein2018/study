import React, {Component} from 'react';

//WrappedComponent  组件作为参数传递
function A(WrappedComponent) {
    return class A extends Component {
        constructor(props){
            super(props);
            console.log(props.age);
            this.state = {
                name:props.name,
                age:18,
                sex:props.sex
            }
        }
        render() {
            return (
                <div>
                    <div >
                      <span>分类1</span>
                      <span>分类2</span>
                      <span>分类3</span>
                    </div>
                    <div>
                        <WrappedComponent age={this.state.age} name={this.state.name} sex={this.state.sex}></WrappedComponent>
                    </div>
                </div>
            );
        }
    }
}


export default A;