import * as fs from "fs";
import { transaction } from "./msig-helpers.js";

// setcontracts
import eosio from '../actions/setcontract-eosio.system.json';
import eosio_token from '../actions/setcontract-eosio.token.json';
import eosio_fees from '../actions/setcontract-eosio.fees.json';
import { execschedule, issuefixed, setmaxsupply, setpayfactor, setschedules, setstrategy, unvest } from "./msig-1-actions.js";

// 1. Deploy new system contracts
for ( const setcontract of [ eosio, eosio_token, eosio_fees ] ) {
    transaction.actions.push(...setcontract.actions);
}

// 3.1. Set max supply 2.1B
const issuer = "eosio";
const supply = "2100000000.0000 EOS";
const memo = "EOS Tokenomics"
setmaxsupply(issuer, supply);

// 3.2. Issue fixed supply up to 2.1B (expected ~972M EOS)
issuefixed(issuer, supply, memo);

// 5.2. Adjust `inflation_pay_factor=60767` factor ratio
const inflation_pay_factor = 60767;
const votepay_factor = 40000;
setpayfactor(inflation_pay_factor, votepay_factor);

// 5.3. Set 4 year halvening schedules (up to 20 years, 6 schedules)
const schedules = [
    {"start_time": new Date("2024-05-17T00:00:00Z"), "continuous_rate": 0.03617097},
    {"start_time": new Date("2024-05-21T00:00:00Z"), "continuous_rate": 0.01808549}
]
setschedules(schedules);

// 5.4. Execute next schedule
execschedule();

// 8.1 Set incoming fees to 100% go to REX via `donatetorex` strategy
const strategy = "donatetorex"
const weight = 10000;
setstrategy(strategy, weight);

fs.writeFileSync(`actions/msig-1-kylin-tokenomics.json`, JSON.stringify(transaction, null, 4));