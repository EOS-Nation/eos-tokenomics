import * as fs from "fs";
import { Serializer } from "@wharfkit/antelope";
import * as Fees from "../codegen/eosio.fees.js"
import { transaction } from "./msig-helpers.js";

// setcontracts
import eosio_fees from '../actions/setcontract-eosio.fees.json';

// 6.1. Deploy fees system contracts
transaction.actions.push(...eosio_fees.actions);

// 7.1 Set incoming fees to 100% go to REX via `donatetorex` strategy
transaction.actions.push({
    account: "eosio.fees",
    name: "setstrategy",
    authorization: [{
        actor: "eosio.fees",
        permission: "owner"
    }],
    data: Serializer.encode({object: Fees.Types.setstrategy.from({
        "strategy": "donatetorex",
        "weight": 10000
    })}).hexString
})

fs.writeFileSync(`actions/msig-2-eosio.fees.json`, JSON.stringify(transaction, null, 4));