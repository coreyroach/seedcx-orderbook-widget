import { combineReducers } from 'redux';
import orderbookReducer from './containers/Orderbook/reducer';

export default combineReducers({
  orderbook: orderbookReducer,
});