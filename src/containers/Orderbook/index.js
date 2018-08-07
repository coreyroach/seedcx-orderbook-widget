import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import './styles.css';

import { connectToSocket } from './actions';

class Orderbook extends Component {

  constructor(props) {
    super(props);
    this.contentRef = React.createRef();
    this.spreadRef = React.createRef();

    this.state = {
      hasConnection: false,
      update: true
    }
  }

  componentWillMount() {
    this.props.connectToSocket();
  }

  componentWillReceiveProps(props) {
    if (!this.state.hasConnection) {
      if (props.asks.length > 0) {
        setTimeout(() => {
          this.spreadRef.current.scrollIntoView({block: 'center'});
        });
        this.setState({
          hasConnection: true
        });
      }
    }
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

  calculateDifference(open, last) {
    const perc = (last/open)-1;
    const c = perc >= 0 ? 'green' : 'red';
    return <span className={c}>{(perc * 100).toFixed(2)}&#37;</span>;
  }

  renderBuckets(asks, bids) {
    if (!this.state.hasConnection) {
      return <span className="loading">Loading...</span>
    }
    return (
      <div>
        <ul className="ask-list">{asks}</ul>
        <div id="Spread" className="spread" ref={this.spreadRef}>
          <p>Midpoint Price: {parseFloat(this.props.price).toFixed(2)} {this.calculateDifference(this.props.open, this.props.price)}</p>
        </div>
        <ul className="bid-list">{bids}</ul>
      </div>
    );
  }

  render() {
    const asksList = this.aggregateByType(this.props.asks, 50).map((ask, idx) => {
      return <li key={idx}><span>{parseFloat(ask[0]).toFixed(2)}</span><span>{parseFloat(ask[1]).toFixed(5)}</span></li>
    }).reverse();

    const bidsList = this.aggregateByType(this.props.bids, 50).map((bid, idx) => {
      return <li key={idx}><span>{parseFloat(bid[0]).toFixed(2)}</span><span>{parseFloat(bid[1]).toFixed(5)}</span></li>
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
          {this.renderBuckets(asksList, bidsList)}
        </div>
      </div>
    );
  }
}

Orderbook.propTypes = {
  connectToSocket: PropTypes.func.isRequired,
  asks: PropTypes.array,
  bids: PropTypes.array,
  price: PropTypes.string,
  open: PropTypes.string,
};

const mapStateToProps = debounce(state => ({
  asks: state.orderbook.asks,
  bids: state.orderbook.bids,
  price: state.orderbook.price,
  open: state.orderbook.open,
}), 250, { leading: true, maxWait: 250 });

export default connect(mapStateToProps, { connectToSocket })(Orderbook);