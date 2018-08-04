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
      price = parseFloat(price) + '';

      if (side === 'sell') {
        const asks = [...state.asks];
        const index = asks.findIndex(item => {
          return parseFloat(item[0]) >= parseFloat(price);
        });

        if (asks[index] && asks[index][0] === price) {
          if (size === '0') {
            asks.splice(index, 1);
          } else {
            asks[index][1] = size;
          }
        } else {
          if (size !== '0') {
            console.log([asks[index][0], price], index);
            asks.splice(index, 0, [price, size]);
          }
        }

        return {
          ...state,
          asks
        }
      }

      if (side === 'buy') {
        const bids = [...state.bids];
        const index = bids.findIndex(item => {
          return item[0] <= price;
        });

        if (bids[index] && bids[index][0] === price) {
          if (size === '0') {
            bids.splice(index, 1);
          } else {
            bids[index][1] = size;
          }
        } else {
          if (size !== '0') {
            bids.splice(index, 0, [price, size]);
          }
        }

        return {
          ...state,
          bids
        }
      }

      return state;

    default:
      return state;
  }
}