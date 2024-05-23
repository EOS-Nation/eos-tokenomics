import * as fs from "fs";
import { transaction } from "./msig-actions.js";

// setcontracts
import code_eosio_fees from '../actions/setcode-eosio.fees.json';
import abi_eosio_fees from '../actions/setabi-eosio.fees.json';

// actions
import { setstrategy } from "./msig-actions.js";

// ❗️ PREREQUISITE Deploy new fees contracts
for ( const setcontract of [ code_eosio_fees, abi_eosio_fees ] ) {
    transaction.actions.push(...setcontract.actions);
}

// 7.1 Set incoming fees to 100% go to REX via `donatetorex` strategy
const strategy = "donatetorex"
const weight = 10000;
setstrategy(strategy, weight);

fs.writeFileSync(`actions/msig-mainnet-eosio.fees.json`, JSON.stringify(transaction, null, 4));