import { Chains } from '@wharfkit/common';
import { APIClient, Bytes, Checksum256, Name, PackedTransaction, Serializer, Transaction } from '@wharfkit/antelope';
import { ABI } from '@wharfkit/antelope';
import * as system from "../build/contracts/eosio.system/eosio.system.abi.json";
import { program } from 'commander';

// Command line arguments
program
  .requiredOption('--proposal <string>', "proposal name", "fees.test")
  .requiredOption('--proposer <string>', "proposer name", "eosnationftw");

const commands = program.parse();
const { proposal, proposer } = commands.opts();

// Chain
const abi = ABI.from(system);
const url = Chains.KylinTestnet.url;
const api = new APIClient({url});

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
    let index = 1;
    for ( const action of unpacked.actions ) {
        const data: any = {};
        const account = action.account.toString();
        try {


            const decoded = action.decodeData(abi);
            for ( let [key, value] of Object.entries(decoded) ) {
                // Sha256 hash the code and abi for eosio contract
                if ( value && value.toJSON ) value = value.toJSON();
                if ( account == "eosio") {
                    if ( key == "abi") {
                        const decodedAbi = Serializer.decode({data: value, type: ABI})
                        const jsonabi = ABI.from(decodedAbi);
                        value = Checksum256.hash(Bytes.fromString(JSON.stringify(jsonabi),'utf8').array).hexString;
                    }
                    if ( key == "code") {
                        value = Checksum256.hash(value).hexString;
                    }
                }
                data[key] = value;
            }
            actions.push({action_index: index++, account, action: action.name.toString(), data});


        } catch (error) {
            // console.error(error);
            actions.push({action_index: index++, account, action: action.name.toString(), hex_data: action.data.hexString});
        }
    }
    return actions;
}

console.log("\nDecoded Actions");
console.log("---------------");
const unpacked = await getTransactionFromMSIG(proposer, proposal);
const decoded = decodeTransaction(unpacked, abi);
decoded.map(action => console.log(action));