import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { connectToSocket } from './actions';

class Orderbook extends Component {

  componentWillMount() {
    this.props.connectToSocket();
  }

  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps', props);
  }

  // shouldComponentUpdate(prevState, nextState) {
  //   console.log('shouldComponentUpdate', prevState, nextState);
  //   return true;
  // };

  aggregateByType(type, limit) {
    if (type.length <= limit) return type;

    const arr = [];
    const generator = {
      [Symbol.iterator]: function* () {
        let n = 0;
        while (true) {
          if (arr.length === limit) return;
          yield type[n];
          n++;
        }
      }
    }

    for (const item of generator) {
      arr.push(item);
    }

    return arr;
  }

  render() {
    const asksList = this.aggregateByType(this.props.asks, 20).map((ask, idx) => {
      return <li key={idx}>{ask[0]} ::: {ask[1]}</li>
    }).reverse();

    const bidsList = this.aggregateByType(this.props.bids, 20).map((bid, idx) => {
      return <li key={idx}>{bid[0]} ::: {bid[1]}</li>
    });

    // const asksList = this.props.asks.slice(0, 50).map((ask, idx) => {
    //   return <li key={idx}>{ask[0]} ::: {ask[1]}</li>;
    // });
    
    // const bidsList = this.props.bids.slice(0, 50).map((bid, idx) => {
    //   return <li key={idx}>{bid[0]} ::: {bid[1]}</li>;
    // });

    return (
      <div>
        <ul>{asksList}</ul>
        <ul>{bidsList}</ul>
      </div>
    );
  }
}

Orderbook.propTypes = {
  connectToSocket: PropTypes.func.isRequired,
  asks: PropTypes.array,
  bids: PropTypes.array
};

const mapStateToProps = state => ({
  asks: state.orderbook.asks,
  bids: state.orderbook.bids
});

export default connect(mapStateToProps, { connectToSocket })(Orderbook);