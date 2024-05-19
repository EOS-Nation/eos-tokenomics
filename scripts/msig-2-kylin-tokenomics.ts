import * as fs from "fs";
import { setdistrib, transaction } from "./msig-actions.js";
import { execschedule, issuefixed, setmaxsupply, setpayfactor, setschedules, setstrategy, unvest } from "./msig-actions.js";

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

// 5.2. Adjust `inflation_pay_factor=60767` factor ratio
const inflation_pay_factor = 60767;
const votepay_factor = 40000;
setpayfactor(inflation_pay_factor, votepay_factor);

// 5.3. Set 4 year halvening schedules (up to 20 years, 6 schedules)
const schedules = [
    {"start_time": new Date("2024-05-17T00:00:00Z"), "continuous_rate": 0.03617097},
    {"start_time": new Date("2024-05-23T00:00:00Z"), "continuous_rate": 0.01808549}
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

fs.writeFileSync(`actions/msig-2-kylin-tokenomics.json`, JSON.stringify(transaction, null, 4));