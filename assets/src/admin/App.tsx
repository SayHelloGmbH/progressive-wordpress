import React from 'react';
import ReactDOM from 'react-dom';

const app = document.querySelector('#pwp-app');
const App = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p>test: {count}</p>
      <button onClick={() => setCount(count + 1)}>count up</button>
    </div>
  );
};

if (app) {
  ReactDOM.render(<App />, app);
}
