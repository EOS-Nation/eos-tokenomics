import * as fs from "fs";
import fees from '../actions/newaccount-eosio.fees.json';
import reward from '../actions/newaccount-eosio.reward.json';

function createTransaction( actions ) {
    return {
        chain_id: fees.chain_id,
        expiration: fees.expiration,
        ref_block_num: fees.ref_block_num,
        ref_block_prefix: fees.ref_block_prefix,
        actions,
    }
};

// Mainnet & Testnet
const actions = [];
for ( const newaccount of [ fees, reward ] ) {
    actions.push(...newaccount.actions);
}
fs.writeFileSync('actions/msig-1-newaccounts.json', JSON.stringify(createTransaction(actions), null, 4));
