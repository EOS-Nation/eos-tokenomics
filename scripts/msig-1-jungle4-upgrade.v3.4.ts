import * as fs from "fs";
import { transaction } from "./msig-helpers.js";

// setcontracts
import eosio from '../actions/setcontract-eosio.system.json';
import eosio_token from '../actions/setcontract-eosio.token.json';
import eosio_fees from '../actions/setcontract-eosio.fees.json';
import { setstrategy } from "./msig-1-actions.js";

// 1. Deploy new system contracts
for ( const setcontract of [ eosio, eosio_token, eosio_fees ] ) {
    transaction.actions.push(...setcontract.actions);
}

// 7.1 Set incoming fees to 100% go to REX via `donatetorex` strategy
const strategy = "donatetorex"
const weight = 10000;
setstrategy(strategy, weight);

fs.writeFileSync(`actions/msig-1-jungle4-upgrade.v3.4.json`, JSON.stringify(transaction, null, 4));