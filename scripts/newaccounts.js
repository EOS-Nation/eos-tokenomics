import * as fs from "fs";
import fees from '../actions/newaccount-eosio.fees.json';
import reward from '../actions/newaccount-eosio.reward.json';
import mware from '../actions/newaccount-eosio.mware.json';
import wram from '../actions/newaccount-fund.wram.json';

const actions = [];
for ( const newaccount of [ fees, reward, mware, wram ] ) {
    actions.push(...newaccount.actions);
}

fees.actions = actions;
fs.writeFileSync('actions/msig-1-newaccounts.json', JSON.stringify(fees, null, 4));