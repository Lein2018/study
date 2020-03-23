import React, {Component} from 'react';
import B from "./B"
import ButtonRef from "./ButtonRef"

class Middle extends Component {
    constructor(props){
        super(props)
        this.state = {
            name:"小唐",
            age:"18",
            sex:"女",
        }
    }
    render() {
        return (
            <div className="content">
                <B name={'Ariel'} sex={'女'} age={'48'}></B>
                {/*{this.state.name}*/}
                {/*{this.state.sex}*/}
                {/*{this.state.age}*/}
                <ButtonRef ></ButtonRef>
            </div>
        );
    }
}

export default Middle;