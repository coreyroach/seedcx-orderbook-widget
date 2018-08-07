import { L2_UPDATE, SNAPSHOT, TICKER } from './types';

export const connectToSocket = () => dispatch => {
  const socket = new WebSocket('wss://ws-feed.pro.coinbase.com');

  const handleMessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'snapshot':
        dispatch({
          type: SNAPSHOT,
          payload: {
            asks: data.asks,
            bids: data.bids
          }
        });
        break;

      case 'l2update':
        dispatch({
          type: L2_UPDATE,
          payload: data.changes[0]
        });
        break;

      case 'ticker':
        dispatch({
          type: TICKER,
          payload: data
        })
        break;

      default:
      // console.log(data);
    }
  };

  socket.addEventListener('message', handleMessage);

  socket.addEventListener('open', () => {
    var subscribe = JSON.stringify({
      type: "subscribe",
      product_ids: [
        "BTC-USD"
      ],
      channels: [
        "level2",
        "ticker",
      ]
    });
    socket.send(subscribe);

    socket.addEventListener('close', () => {
      console.log('Client disconnected.');
    });
  });
};