import React, {Component} from 'react';
import C from './C'

class D extends Component {
    render() {
        return (
            <div>
               我是D组件
            </div>
        );
    }
}

export default C(D);