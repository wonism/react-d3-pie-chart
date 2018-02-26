import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import fp from 'lodash/fp';
import ReactD3PieChart from '../src';

const appRoot = document.getElementById('root');

class DemoApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { label: 'A', value: 10 },
        { label: 'B', value: 22 },
        { label: 'C', value: 5 },
        { label: 'D', value: 0 },
        { label: 'E', value: 8 },
      ],
    };
  }

  handleClick = () => {
    const lastData = fp.last(this.state.data);
    const { label } = lastData;
    const newLabel = String.fromCharCode(label.charCodeAt() + 1);
    const newValue = Math.floor(Math.random() * 31);

    this.setState({
      data: [
        ...this.state.data,
        { label: newLabel, value: newValue },
      ],
    });
  }

  renderLabel = d => `Label is ${d.data.label}`

  render() {
    return (
      <main>
        <ReactD3PieChart data={this.state.data} tooltip renderLabel={this.renderLabel} />
        <button onClick={this.handleClick}>Add Data</button>
      </main>
    );
  }
}

render(<DemoApp />, appRoot);
