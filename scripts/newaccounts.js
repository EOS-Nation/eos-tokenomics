import * as fs from "fs";
import fees from '../actions/newaccount-eosio.fees.json';
import reward from '../actions/newaccount-eosio.reward.json';
import mware from '../actions/newaccount-eosio.mware.json';
import wram from '../actions/newaccount-fund.wram.json';

function createTransaction( actions ) {
    return {
        chain_id: fees.chain_id,
        expiration: fees.expiration,
        ref_block_num: fees.ref_block_num,
        ref_block_prefix: fees.ref_block_prefix,
        actions,
    }
};

// Mainnet
const actions = [];
for ( const newaccount of [ fees, reward, mware, wram ] ) {
    actions.push(...newaccount.actions);
}
fs.writeFileSync('actions/msig-1-newaccounts.json', JSON.stringify(createTransaction(actions), null, 4));

// Testnets
const actions_testnet = [];
for ( const newaccount of [ fees, reward ] ) {
    actions_testnet.push(...newaccount.actions);
}
fs.writeFileSync('actions/testnet-msig-1-newaccounts.json', JSON.stringify(createTransaction(actions_testnet), null, 4));