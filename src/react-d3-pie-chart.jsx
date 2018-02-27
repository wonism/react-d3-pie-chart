import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  arc,
  pie,
  scaleOrdinal,
} from 'd3';
import { select } from 'd3-selection';
import { interpolate } from 'd3-interpolate';
import fp from 'lodash/fp';

export default class ReactD3PieChart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      PropTypes.number
    ).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string),
    width: PropTypes.number,
    height: PropTypes.number,
    transition: PropTypes.number,
    renderLabel: PropTypes.func,
  };

  static defaultProps = {
    colors: [],
    width: 500,
    height: 500,
    transition: 400,
    renderLabel: (d => fp.get('data.label')(d) || d.value),
  };

  constructor(props) {
    super(props);
    this.state = {
      colors: [],
    };
  }

  componentDidMount() {
    this.initColors();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!fp.isEmpty(prevState.colors) && fp.isEqual(prevState.colors)(this.state.colors)) {
      this.initColors();
    } else {
      this.clearChart();
      this.createChart();
    }
  }

  initColors = () => {
    const colors = this.props.data.map((data, i) => {
      const hexCode = fp.replace(/^#/, '')(this.props.colors[i]);
      if (/^([a-f0-9]{3}|[a-f0-9]{6})$/.test(hexCode)) {
        return hexCode;
      }

      const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

      return randomHex;
    });

    this.setState({ colors });
  }

  clearChart = () => {
    const { $chart } = this;

    select($chart)
      .selectAll('*')
      .remove();
  }

  createChart = () => {
    const { $chart } = this;
    const { data, width, height, transition, renderLabel } = this.props;
    const radius = Math.min(width, height) / 2;
    const colors = scaleOrdinal().range(this.state.colors);
    const filteredData = fp.filter(d => (d.value || d) > 0)(data);

    const path = arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const label = arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    const sortedPie = pie()
      .sort(null)
      .value(d => d.value || d);

    const svg = select($chart)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const g = svg
      .selectAll('.arc')
      .data(sortedPie(filteredData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    g.append('path')
      .style('fill', d => colors(d.value || d))
      .transition()
      .duration(transition)
      .attrTween('d', (d) => {
        const i = interpolate(d.startAngle + 0.1, d.endAngle);

        return (t) => {
          d.endAngle = i(t);
          return path(d);
        };
      });

    g.append('text')
      .attr('transform', d => `translate(${label.centroid(d)})`)
      .attr('dy', '.35em')
      .transition()
      .delay(transition)
      .text(renderLabel);
  }

  render() {
    const { width, height } = this.props;

    return (
      <svg
        ref={(chart) => { this.$chart = chart; }}
        width={width}
        height={height}
      />
    );
  }
}
