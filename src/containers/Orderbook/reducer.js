import { SNAPSHOT, L2_UPDATE, TICKER } from './types';

const initialState = {
  asks: [],
  bids: [],
  price: '0',
  open: '0'
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
      console.log('L2_UPDATE');
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

    case TICKER :
      return {
        ...state,
        price: action.payload.price,
        open: action.payload.open_24h,
      };

    default:
      return state;
  }
}