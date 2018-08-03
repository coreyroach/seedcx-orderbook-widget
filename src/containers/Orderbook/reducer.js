import { SNAPSHOT, L2_UPDATE } from './types';

const initialState = {
  asks: [],
  bids: []
};

export default function(state = initialState, action) {
  switch (action.type) {

    case SNAPSHOT:
      return {
        ...state,
        asks: action.payload.asks,
        bids: action.payload.bids
      };

    case L2_UPDATE:
      let [side, price, size] = [...action.payload];
      const bucket = side === 'buy' ? state.bids : state.asks;
      price = parseFloat(price) + '';

      for (let i = 0, a = bucket.length; i<a; i++) {
        if (price === bucket[i][0]) {
          bucket[i][1] = size;
          break;
        }
        if (i > bucket[i][0]) {
          bucket.splice(i, 0, [price, size]);
          break;
        }
      }

      const newState = {
        asks: side === 'sell' ? bucket : state.asks,
        bids: side === 'buy'  ? bucket : state.bids,
      };

      return newState;

    default:
      return state;
  }
}