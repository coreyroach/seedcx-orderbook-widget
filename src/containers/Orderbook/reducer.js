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
      let [side, price, size] = action.payload;
      price = parseFloat(price) + '';


      const bucket = side === 'sell' ? [...state.asks] : [...state.bids];
      const index = bucket.findIndex(item => {
        if (side === 'sell') {
          return parseFloat(item[0]) >= parseFloat(price);
        }
        return parseFloat(item[0]) <= parseFloat(price);
      });

      if (bucket[index] && bucket[index][0] === price) {
        if (size === '0') {
          bucket.splice(index, 1);
        } else {
          bucket[index][1] = size;
        }
      } else {
        if (size !== '0') {
          bucket.splice(index, 0, [price, size]);
        }
      }

      return {
        ...state,
        asks: side === 'sell' ? bucket : state.asks,
        bids: side !== 'sell' ? bucket : state.bids,
      }

      return state;

    default:
      return state;
  }
}