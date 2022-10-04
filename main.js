import React from 'react';
import ReactDOM from 'react-dom';

class Task extends React.Component {
    render() {
        return <div class="task"></div>
    }
}

ReactDOM.render(
    <Task />,
    document.getElementById("tasks")
);