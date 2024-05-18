import * as fs from "fs";
import { transaction } from "./msig-helpers.js";

// setcontracts
import eosio from '../actions/setcontract-eosio.system.json';
import eosio_token from '../actions/setcontract-eosio.token.json';
import eosio_fees from '../actions/setcontract-eosio.fees.json';

// 1. Deploy new system contracts
for ( const setcontract of [ eosio, eosio_token, eosio_fees ] ) {
    transaction.actions.push(...setcontract.actions);
}

fs.writeFileSync(`actions/msig-1-jungle4-upgrade.v3.4.json`, JSON.stringify(transaction, null, 4));