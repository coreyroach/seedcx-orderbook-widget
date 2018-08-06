import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';

import { connectToSocket } from './actions';

class Orderbook extends Component {

  componentWillMount() {
    this.props.connectToSocket();
  }

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
    const asksList = this.aggregateByType(this.props.asks, 50).map((ask, idx) => {
      return <li key={idx}><span>{ask[0]}</span><span>{ask[1]}</span></li>
    }).reverse();

    const bidsList = this.aggregateByType(this.props.bids, 50).map((bid, idx) => {
      return <li key={idx}><span>{bid[0]}</span><span>{bid[1]}</span></li>
    });

    return (
      <div id="Orderbook">
        <header>
          <h3>BTC-USD</h3>
          <div className="list-head">
            <p>Price (USD)</p>
            <p>Market Size</p>
          </div>
        </header>
        <div className="content">
          <ul className="ask-list">{asksList}</ul>
          <div className="spread">
            <p>Spread</p>
          </div>
          <ul className="bid-list">{bidsList}</ul>
        </div>
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