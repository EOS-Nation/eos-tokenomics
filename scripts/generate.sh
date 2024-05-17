# new contracts
npx @wharfkit/cli generate --json ./build/contracts/eosio.fees/eosio.fees.abi --file ./codegen/eosio.fees.ts eosio.fees
npx @wharfkit/cli generate --json ./build/contracts/eosio.system/eosio.system.abi --file ./codegen/eosio.system.ts eosio
npx @wharfkit/cli generate --json ./build/contracts/eosio.token/eosio.token.abi --file ./codegen/eosio.token.ts eosio.token

# existing
npx @wharfkit/cli generate --url https://eos.greymass.com --file ./codegen/time.eosn.ts time.eosn
npx @wharfkit/cli generate --url https://eos.greymass.com --file ./codegen/eosio.saving.ts eosio.saving