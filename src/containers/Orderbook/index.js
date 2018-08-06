import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';

import { connectToSocket } from './actions';

class Orderbook extends Component {

  constructor(props) {
    super(props);
    this.contentRef = React.createRef();

    this.state = {
      hasConnection: false
    }
  }

  componentWillMount() {
    this.props.connectToSocket();
  }

  componentWillReceiveProps(props) {
    if (!this.state.hasConnection) {
      console.log('testing');
      if (props.asks.length > 0) {
        const spread = document.getElementById('Spread');
        spread.scrollIntoView();
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

  render() {
    const asksList = this.aggregateByType(this.props.asks, 50).map((ask, idx) => {
      return <li key={idx}><span>{parseFloat(ask[0]).toFixed(2)}</span><span>{parseFloat(ask[1]).toFixed(5)}</span></li>
    }).reverse();

    const bidsList = this.aggregateByType(this.props.bids, 50).map((bid, idx) => {
      return <li key={idx}><span>{parseFloat(bid[0]).toFixed(2)}</span><span>{parseFloat(bid[1]).toFixed(5)}</span></li>
    });

    // console.log(this.contentRef);

    return (
      <div id="Orderbook">
        <header>
          <h3>BTC-USD</h3>
          <div className="list-head">
            <p>Price (USD)</p>
            <p>Market Size</p>
          </div>
        </header>
        <div className="content" ref={this.contentRef}>
          <ul className="ask-list">{asksList}</ul>
          <div id="Spread" className="spread">
            <p>Midpoint Price: {parseFloat(this.props.price).toFixed(2)} {this.calculateDifference(this.props.open, this.props.price)}</p>
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
  bids: PropTypes.array,
  price: PropTypes.string,
  open: PropTypes.string,
};

const mapStateToProps = state => ({
  asks: state.orderbook.asks,
  bids: state.orderbook.bids,
  price: state.orderbook.price,
  open: state.orderbook.open,
});

export default connect(mapStateToProps, { connectToSocket })(Orderbook);