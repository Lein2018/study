import React, {Component} from 'react';
import A from './A'
// @A
class ButtonRef extends Component {
    handleClick(){
        console.log(this.myTextInput);
    }
    render() {
        return (
            <div >
                <input ref={(ref) => this.myTextInput = ref} type="text" />
                <button onClick={()=>this.handleClick()}>
                    点击我
                </button>
            </div>
        );
    }
}
export default ButtonRef;
