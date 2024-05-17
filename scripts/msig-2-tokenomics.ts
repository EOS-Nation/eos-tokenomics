import * as fs from "fs";
import { Serializer } from "@wharfkit/antelope";
import * as Token from "../codegen/eosio.token.js"
import * as System from "../codegen/eosio.system.js"
import * as Fees from "../codegen/eosio.fees.js"
import * as Time from "../codegen/time.eosn.js"
import * as Saving from "../codegen/eosio.saving.js"
import { transaction } from "./msig-helpers.js";

// Flags
const TESTNET = process.argv[2] === '--testnet';

// newaccounts
import mware from '../actions/newaccount-eosio.mware.json';
import wram from '../actions/newaccount-fund.wram.json';

// setcontracts
import eosio from '../actions/setcontract-eosio.system.json';
import eosio_token from '../actions/setcontract-eosio.token.json';
import eosio_fees from '../actions/setcontract-eosio.fees.json';

// 1. Deploy new system contracts
for ( const setcontract of [ eosio, eosio_token, eosio_fees ] ) {
    transaction.actions.push(...setcontract.actions);
}

// 2.1. Unvest B1 tokens (35M EOS NET + 29.6M EOS CPU)
if ( !TESTNET ) {
    transaction.actions.push({
        account: "eosio",
        name: "unvest",
        authorization: [{
            actor: "eosio",
            permission: "active"
        }],
        data: Serializer.encode({object: System.Types.unvest.from({
            account: "b1",
            unvest_net_quantity: "35007851.2340 EOS",
            unvest_cpu_quantity: "29662497.5145 EOS"
        })}).hexString
    })
}

// 3.1. Set max supply 2.1B
transaction.actions.push({
    account: "eosio.token",
    name: "setmaxsupply",
    authorization: [{
        actor: "eosio",
        permission: "active"
    }],
    data: Serializer.encode({object: Token.Types.setmaxsupply.from({
        issuer: "eosio",
        maximum_supply: "2100000000.0000 EOS"
    })}).hexString
})

// 3.2. Issue fixed supply up to 2.1B (expected ~972M EOS)
transaction.actions.push({
    account: "eosio.token",
    name: "issuefixed",
    authorization: [{
        actor: "eosio",
        permission: "active"
    }],
    data: Serializer.encode({object: Token.Types.issuefixed.from({
        to: "eosio",
        supply: "2100000000.0000 EOS",
        memo: "EOS Tokenomics"
    })}).hexString
})

// 4.1. Create new bucket accounts
if ( !TESTNET ) {
    for ( const newaccount of [ mware, wram ] ) {
        transaction.actions.push(...newaccount.actions);
    }

    // 4.2. Transfer 350M from `eosio` to `fund.wram`
    // 4.3. Transfer 15M from `eosio` to `eosio.mware`
    const transfers = [
        { from: "eosio", to: "fund.wram", quantity: "350000000.0000 EOS", memo: "EOS Tokenomics" },
        { from: "eosio", to: "eosio.mware", quantity: "15000000.0000 EOS", memo: "EOS Tokenomics" },
    ]
    transfers.forEach(transfer => {
        transaction.actions.push({
            account: "eosio.token",
            name: "transfer",
            authorization: [{
                actor: "eosio",
                permission: "active"
            }],
            data: Serializer.encode({object: Token.Types.transfer.from(transfer)}).hexString
        })
    });
}

// 5.2. Adjust `inflation_pay_factor=60767` factor ratio
transaction.actions.push({
    account: "eosio",
    name: "setpayfactor",
    authorization: [{
        actor: "eosio",
        permission: "active"
    }],
    data: Serializer.encode({object: System.Types.setpayfactor.from({
        inflation_pay_factor: 60767,
        votepay_factor: 40000
    })}).hexString
})

// 5.3. Set 4 year halvening schedules (up to 20 years, 6 schedules)
const schedules = TESTNET ? [
    {"start_time": new Date("2024-05-17T00:00:00Z"), "continuous_rate": 0.03617097},
    {"start_time": new Date("2024-05-21T00:00:00Z"), "continuous_rate": 0.01808549},
] : [
    {"start_time": new Date("2024-06-01T00:00:00Z"), "continuous_rate": 0.03617097},
    {"start_time": new Date("2028-06-01T00:00:00Z"), "continuous_rate": 0.01808549},
    {"start_time": new Date("2032-06-01T00:00:00Z"), "continuous_rate": 0.00904274},
    {"start_time": new Date("2036-06-01T00:00:00Z"), "continuous_rate": 0.00452137},
    {"start_time": new Date("2040-06-01T00:00:00Z"), "continuous_rate": 0.00226069},
    {"start_time": new Date("2044-06-01T00:00:00Z"), "continuous_rate": 0.00113034}
]
schedules.forEach((schedule, index) => {
    transaction.actions.push({
        account: "eosio",
        name: "setschedule",
        authorization: [{
            actor: "eosio",
            permission: "active"
        }],
        data: Serializer.encode({object: System.Types.setschedule.from(schedule)}).hexString
    })
});

// 5.4. Execute next schedule
transaction.actions.push({
    account: "eosio",
    name: "execschedule",
    authorization: [{
        actor: "eosio",
        permission: "active"
    }],
    data: ""
})

// 5.5. Set MSIG execution time
if ( !TESTNET ) {
    transaction.actions.push({
        account: "time.eosn",
        name: "checktime",
        authorization: [{
            actor: "eosio",
            permission: "active"
        }],
        data: Serializer.encode({object: Time.Types.checktime.from({
            time: new Date("2024-06-01T00:00:00.000Z")
        })}).hexString
    })
}

// 5.5. Set `eosio.savings` ratio for Staking Rewards/ENF/Labs (53.71% / 29.55% / 16.74%)
if ( !TESTNET ) {
    transaction.actions.push({
        account: "eosio.saving",
        name: "setdistrib",
        authorization: [{
            actor: "eosio.saving",
            permission: "active"
        }],
        data: Serializer.encode({object: Saving.Types.setdistrib.from({
            accounts: [
                {account: "eosio.reward", percent: 5371},
                {account: "eosio.grants", percent: 2955},
                {account: "eoslabs.io", percent: 1674}
            ]
        })}).hexString
    })
}

// 6.1 Set incoming fees to 100% go to REX via `donatetorex` strategy
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

fs.writeFileSync(`actions/${TESTNET ? "testnet-" : ""}msig-2-tokenomics.json`, JSON.stringify(transaction, null, 4));