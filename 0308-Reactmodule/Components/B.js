import React, {Component} from 'react';
import A from './A'

@A
class B extends Component {
    render() {
        return (
            <div>
                <p>我叫：{this.props.name}</p>
                <p>今年：{this.props.age}</p>
                <p>性别：{this.props.sex}</p>
            </div>
        );
    }
}

export default B;
// export default A(B);