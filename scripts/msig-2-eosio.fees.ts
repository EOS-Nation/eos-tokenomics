import * as fs from "fs";
import { transaction } from "./msig-helpers.js";
import { setstrategy } from "./msig-1-actions.js";

// setcontracts
import eosio_fees from '../actions/setcontract-eosio.fees.json';

// 7.1. Deploy fees system contracts
transaction.actions.push(...eosio_fees.actions);

// 8.1 Set incoming fees to 100% go to REX via `donatetorex` strategy
const strategy = "donatetorex"
const weight = 10000;
setstrategy(strategy, weight);

fs.writeFileSync(`actions/msig-2-eosio.fees.json`, JSON.stringify(transaction, null, 4));