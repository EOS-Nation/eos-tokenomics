import * as fs from "fs";

// actions
import { init_fees, transaction } from "./msig-actions.js";

// 7.2 Initialize fees contract to 600 seconds per epoch period
const seconds = 600;
init_fees(seconds);

fs.writeFileSync(`actions/msig-mainnet-eosio.fees-init.json`, JSON.stringify(transaction, null, 4));
