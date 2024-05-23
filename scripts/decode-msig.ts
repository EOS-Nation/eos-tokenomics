import { Chains } from '@wharfkit/common';
import { APIClient, Name, PackedTransaction, Transaction } from '@wharfkit/antelope';
import { ABI } from '@wharfkit/antelope';
import * as system from "../build/contracts/eosio.system/eosio.system.abi.json";

const abi = ABI.from(system);
const url = Chains.EOS.url;
const api = new APIClient({url});

const proposer = "eosnationftw";
const proposal = "bloks.test4";

console.log("MSIG Proposal Decoder");
console.log("----------------------");
console.log("proposer:", proposer);
console.log("proposal:", proposal);
console.log("url:", url);

async function getTransactionFromMSIG(proposer: string, proposal: string) {
    const rows = await api.v1.chain.get_table_rows({
        code: "eosio.msig",
        scope: proposer,
        table: "proposal",
        lower_bound: Name.from(proposal),
        upper_bound: Name.from(proposal),
        key_type: "name",
    })
    const packed_trx = rows.rows[0].packed_transaction;
    const packed = PackedTransaction.from({packed_trx});
    return packed.getTransaction()
}

function decodeTransaction(unpacked: Transaction, abi: ABI ) {
    const actions = [];
    let index = 0;
    for ( const action of unpacked.actions ) {
        const decoded = action.decodeData(abi);
        const data: any = {};
        for ( let [key, value] of Object.entries(decoded) ) {
            if ( value && value.toJSON ) value = value.toJSON();
            if ( key == "abi") value = "...";
            if ( key == "code") value = "...";
            data[key] = value;
        }
        actions.push({action_index: index++, account: action.account.toString(), action: action.name.toString(), data});
    }
    return actions;
}

console.log("\nDecoded Actions");
console.log("---------------");
const unpacked = await getTransactionFromMSIG(proposer, proposal);
const decoded = decodeTransaction(unpacked, abi);
decoded.map(action => console.log(action));