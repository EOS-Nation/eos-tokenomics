import { Serializer } from "@wharfkit/antelope";
import * as Token from "../codegen/eosio.token.js"
import * as System from "../codegen/eosio.system.js"
import * as Time from "../codegen/time.eosn.js"
import * as Saving from "../codegen/eosio.saving.js"
import * as Fees from "../codegen/eosio.fees.js"

export interface Action {
    account: string;
    name: string;
    authorization: { actor: string, permission: string }[];
    data: string;
}

export const transaction: {expiration: string, actions: Action[]} = {
    expiration: "2025-01-01T00:00:00",
    actions: [],
}

// 0. Set MSIG execution time
export function checktime(date = "2024-06-01T00:00:00.000Z") {
    transaction.actions.push({
        account: "time.eosn",
        name: "checktime",
        authorization: [{
            actor: "eosio",
            permission: "active"
        }],
        data: Serializer.encode({object: Time.Types.checktime.from({
            time: new Date(date),
        })}).hexString,
    })
}


// 2.1. Unvest B1 tokens (35M EOS NET + 29.6M EOS CPU)
export function unvest(account: string, unvest_net_quantity: string, unvest_cpu_quantity: string) {
    transaction.actions.push({
        account: "eosio",
        name: "unvest",
        authorization: [{
            actor: "eosio",
            permission: "active"
        }],
        data: Serializer.encode({object: System.Types.unvest.from({
            account,
            unvest_net_quantity,
            unvest_cpu_quantity
        })}).hexString
    })
}

// 3.1. Set max supply 2.1B
export function setmaxsupply( issuer: string, maximum_supply: string) {
    transaction.actions.push({
        account: "eosio.token",
        name: "setmaxsupply",
        authorization: [{
            actor: "eosio",
            permission: "active"
        }],
        data: Serializer.encode({object: Token.Types.setmaxsupply.from({
            issuer,
            maximum_supply
        })}).hexString
    })
}

// 3.2. Issue fixed supply up to 2.1B (expected ~972M EOS)
export function issuefixed( to: string, supply: string, memo: string) {
    transaction.actions.push({
        account: "eosio.token",
        name: "issuefixed",
        authorization: [{
            actor: "eosio",
            permission: "active"
        }],
        data: Serializer.encode({object: Token.Types.issuefixed.from({
            to,
            supply,
            memo
        })}).hexString
    })
}

// 4.2. Transfer 350M from `eosio` to `fund.wram`
// 4.3. Transfer 15M from `eosio` to `eosio.mware`
export function send_transfers(transfers: {from: string, to: string, quantity: string, memo: string}[]) {
    for ( const transfer of transfers ) {
        transaction.actions.push({
            account: "eosio.token",
            name: "transfer",
            authorization: [{
                actor: "eosio",
                permission: "active"
            }],
            data: Serializer.encode({object: Token.Types.transfer.from(transfer)}).hexString
        })
    }
}

// 5.2. Adjust `inflation_pay_factor=60767` factor ratio
export function setpayfactor( inflation_pay_factor = 60767, votepay_factor = 40000 ) {
    transaction.actions.push({
        account: "eosio",
        name: "setpayfactor",
        authorization: [{
            actor: "eosio",
            permission: "active"
        }],
        data: Serializer.encode({object: System.Types.setpayfactor.from({
            inflation_pay_factor,
            votepay_factor
        })}).hexString
    })
}

// 5.3. Set 4 year halvening schedules (up to 20 years, 6 schedules)
export function setschedules(schedules: {start_time: Date, continuous_rate: number}[]) {
    for ( const schedule of schedules ) {
        transaction.actions.push({
            account: "eosio",
            name: "setschedule",
            authorization: [{
                actor: "eosio",
                permission: "active"
            }],
            data: Serializer.encode({object: System.Types.setschedule.from(schedule)}).hexString
        })
    };
}

// 5.4. Execute next schedule
export function execschedule() {
    transaction.actions.push({
        account: "eosio",
        name: "execschedule",
        authorization: [{
            actor: "eosio",
            permission: "active"
        }],
        data: ""
    })
}

// 6.1. Set `eosio.savings` ratios
export function setdistrib(accounts: {account: string, percent: number}[]) {
    transaction.actions.push({
        account: "eosio.saving",
        name: "setdistrib",
        authorization: [{
            actor: "eosio.saving",
            permission: "active"
        }],
        data: Serializer.encode({object: Saving.Types.setdistrib.from({
            accounts
        })}).hexString
    })
}

// 7.1 Set incoming fees to 100% go to REX via `donatetorex` strategy
export function setstrategy(strategy: string, weight: number) {
    transaction.actions.push({
        account: "eosio.fees",
        name: "setstrategy",
        authorization: [{
            actor: "eosio.fees",
            permission: "owner"
        }],
        data: Serializer.encode({object: Fees.Types.setstrategy.from({
            strategy,
            weight,
        })}).hexString
    })
}
