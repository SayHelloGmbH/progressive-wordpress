import React from 'react';
import ReactDOM from 'react-dom';
import {Link, useLocation} from "./src/location";

const app = document.querySelector('#pwp-app');
const App = () => {
    const [count, setCount] = React.useState(0);
    const location = useLocation();
    return (
        <div>
            <p>test: {count}</p>
            <button onClick={() => setCount(count + 1)}>count up</button>
            <br/>{location}<br/>
            <Link to="hallo">Hallo</Link>
            <Link to="welt">Welt</Link>
        </div>
    );
};

if (app) {
    ReactDOM.render(<App/>, app);
}
