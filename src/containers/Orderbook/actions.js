import { L2_UPDATE, SNAPSHOT } from './types';

export const connectToSocket = () => dispatch => {
  const socket = new WebSocket('wss://ws-feed.pro.coinbase.com');

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'snapshot' :
        dispatch({
          type: SNAPSHOT,
          payload: {
            asks: data.asks,
            bids: data.bids
          }
        });
        break;
      
      case 'l2update' :
        dispatch({
          type: L2_UPDATE,
          payload: data.changes[0]
        });
        break;
      
      default :
        console.log(data);
    }
  });

  socket.addEventListener('open', function (event) {
    var subscribe = JSON.stringify({
      type: "subscribe",
      product_ids: [
        "BTC-USD"
      ],
      channels: [
        "level2",
        // "heartbeat",
        // {
        //   name: "ticker",
        //   product_ids: [
        //     "BTC-USD"
        //   ]
        // }
      ]
    });
    socket.send(subscribe);

    socket.addEventListener('close', function (event) {
      console.log('Client disconnected.');
    });
  });
};