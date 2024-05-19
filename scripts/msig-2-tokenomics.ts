import * as fs from "fs";
import { transaction } from "./msig-actions.js";

// newaccounts
import mware from '../actions/newaccount-eosio.mware.json';
import wram from '../actions/newaccount-fund.wram.json';

// setcontract
import { checktime, execschedule, issuefixed, send_transfers, setdistrib, setmaxsupply, setpayfactor, setschedules, setstrategy, unvest } from "./msig-actions.js";

// 1. Set MSIG execution time
checktime("2024-06-01T00:00:00.000Z");

// 2.1. Unvest B1 tokens (35M EOS NET + 29.6M EOS CPU)
const unvest_net_quantity = "35007851.2340 EOS";
const unvest_cpu_quantity = "29662497.5145 EOS";
unvest("b1", unvest_net_quantity, unvest_cpu_quantity);

// 3.1. Set max supply 2.1B
const issuer = "eosio";
const supply = "2100000000.0000 EOS";
const memo = "EOS Tokenomics"
setmaxsupply(issuer, supply);

// 3.2. Issue fixed supply up to 2.1B (expected ~972M EOS)
issuefixed(issuer, supply, memo);

// 4.1. Create new bucket accounts
for ( const newaccount of [ mware, wram ] ) {
    transaction.actions.push(...newaccount.actions);
}

// 4.2. Transfer 350M from `eosio` to `fund.wram`
// 4.3. Transfer 15M from `eosio` to `eosio.mware`
const transfers = [
    { from: "eosio", to: "fund.wram", quantity: "350000000.0000 EOS", memo: "EOS Tokenomics" },
    { from: "eosio", to: "eosio.mware", quantity: "15000000.0000 EOS", memo: "EOS Tokenomics" },
]
send_transfers(transfers);

// 5.2. Adjust `inflation_pay_factor=60767` factor ratio
const inflation_pay_factor = 60767;
const votepay_factor = 40000;
setpayfactor(inflation_pay_factor, votepay_factor);

// 5.3. Set 4 year halvening schedules (up to 20 years, 6 schedules)
const schedules = [
    {"start_time": new Date("2024-06-01T00:00:00Z"), "continuous_rate": 0.03617097},
    {"start_time": new Date("2028-06-01T00:00:00Z"), "continuous_rate": 0.01808549},
    {"start_time": new Date("2032-06-01T00:00:00Z"), "continuous_rate": 0.00904274},
    {"start_time": new Date("2036-06-01T00:00:00Z"), "continuous_rate": 0.00452137},
    {"start_time": new Date("2040-06-01T00:00:00Z"), "continuous_rate": 0.00226069},
    {"start_time": new Date("2044-06-01T00:00:00Z"), "continuous_rate": 0.00113034}
]
setschedules(schedules);

// 5.4. Execute next schedule
execschedule();

// 6.1. Set `eosio.savings` ratios
const accounts = [
    {account: "eosio.reward", percent: 5371},
    {account: "eosio.grants", percent: 2955},
    {account: "eoslabs.io", percent: 1674}
]
setdistrib(accounts);

// 7.1 Set incoming fees to 100% go to REX via `donatetorex` strategy
const strategy = "donatetorex"
const weight = 10000;
setstrategy(strategy, weight);

fs.writeFileSync(`actions/msig-2-tokenomics.json`, JSON.stringify(transaction, null, 4));