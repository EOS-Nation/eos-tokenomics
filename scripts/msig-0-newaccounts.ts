import * as fs from "fs";
import fees from '../actions/newaccount-eosio.fees.json';
import reward from '../actions/newaccount-eosio.reward.json';
import { transaction } from "./msig-actions";

for ( const newaccount of [ fees, reward ] ) {
    transaction.actions.push(...newaccount.actions);
}
fs.writeFileSync('actions/msig-0-newaccounts.json', JSON.stringify(transaction, null, 4));
