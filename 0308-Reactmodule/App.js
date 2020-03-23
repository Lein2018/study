import React, {Component} from 'react';
import './App.css';
// import A from './Components/A'
// import B from './Components/B'
// import D from './Components/D'
import Header from './Components/Header'
import Middle from './Components/Middle'
import Footer from './Components/Footer'

class App extends Component {
    render() {
        return (
            <div className="main">
                {/*欢迎大家来到网易云课堂，《前端高级开发工程师 》微专业直播公开课。*/}
                {/*<A></A>*/}
                {/*<B name={'小唐'} sex={'女'} age={'18'}></B>*/}
                {/*<D></D>*/}
                <Header></Header>
                <Middle></Middle>
                <Footer></Footer>

            </div>
        );
    }
}

export default App;
