# EOS Tokenomics (System Contract v3.4.0 Upgrade)

> [Release Notes](https://github.com/eosnetworkfoundation/eos-system-contracts/releases/tag/v3.4.0)

## [Build CDT](https://github.com/AntelopeIO/cdt) (`v4.0.1`)

```bash
git clone --recursive https://github.com/AntelopeIO/cdt
cd cdt
git checkout v4.0.1
mkdir build
cd build
cmake ..
make -j $(nproc)
```

## [Compile EOS System Contracts](https://github.com/eosnetworkfoundation/eos-system-contracts/releases/tag/v3.4.0) (`v3.4.0`)

```bash
gh repo clone eosnetworkfoundation/eos-system-contracts
cd eos-system-contracts
git checkout v3.4.0
export CDT_INSTALL_DIR="<path>/cdt/build"
./build.sh
```

```bash
$ shasum -a 256 ./build/contracts/eosio.system/eosio.system.wasm
a2d...930  ./build/contracts/eosio.system/eosio.system.wasm

$ shasum -a 256 ./build/contracts/eosio.token/eosio.token.wasm
ecb...8bb  ./contracts/eosio.token/eosio.token.wasm

$ shasum -a 256 ./build/contracts/eosio.fees/eosio.fees.wasm
9bd...3e8  ./contracts/eosio.fees/eosio.fees.wasm
```

## MSIG Schedules

### MSIG Step 1 - New system accounts
> https://bloks.io/msig/eosnationftw/newaccounts

Create new systems accounts for:
- `eosio.fees` (15/21) (`eosio`)
- `eosio.reward` (15/21) (`eosio`)

### MSIG Step 2 - [`upgrade.v3.4` contracts](https://github.com/eosnetworkfoundation/eos-system-contracts/releases/tag/v3.4.0) & EOS Tokenomics
> https://bloks.io/msig/larosenonaka/tokenomics

#### Deploy new v3.4.0 system contracts
1.1. Deploy new `eosio` system contract
1.2. Deploy new `eosio.token` contract
1.3. Deploy new [`eosio.fees`](https://github.com/eosnetworkfoundation/eosio.fees) contract

#### B1 unvest
2.1. Unvest B1 tokens (35M EOS NET + 29.6M EOS CPU)

**eosio::unvest**
```json
{
    "account": "b1",
    "unvest_net_quantity": "35007851.2340 EOS",
    "unvest_cpu_quantity": "29662497.5145 EOS"
}
```

2.2. Tokens are retired from active supply

#### Set Max Supply
3.1. Set max supply 2.1B

**eosio.token::setmaxsupply**
```json
{
    "issuer": "eosio",
    "maximum_supply": "2100000000.0000 EOS"
}
```

3.2. Issue fixed supply up to 2.1B (expected ~972M EOS)
**eosio.token::issuefixed**
```json
{
    "to": "eosio",
    "supply": "2100000000.0000 EOS",
    "memo": "EOS Tokenomics"
}
```

#### Transfer EOS to buckets

4.1. Create new bucket accounts
- `eosio.mware` (2/2) (`larosenonaka` + `winston1efm1`)
- `fund.wram` (2/2) (`larosenonaka` + `winston1efm1`)

4.2. Transfer 350M from `eosio` to `fund.wram`
4.3. Transfer 15M from `eosio` to `eosio.mware`
4.4. Remaining ~607M EOS in `eosio` to be distributed via producer pay & `eosio.saving`

#### Set vesting
5.2. Adjust `inflation_pay_factor=60767` factor ratio to:

| ratio  | receiver |
|--------|----------|
| 16.46% | block producers (**bpay** & **vpay**)
| 83.54% | `eosio.saving` (Rewards, ENF & Labs)

**eosio::setpayfactor**
```json
{
    "inflation_pay_factor": 60767,
    "votepay_factor": 40000
}
```

5.3. Set 4 year halvening schedules (up to 20 years, 6 schedules)

**eosio::setschedule** (multiple actions)
```json
[
  {"start_time": "2024-06-01T00:00:00Z", "continuous_rate": 0.03617097},
  {"start_time": "2028-06-01T00:00:00Z", "continuous_rate": 0.01808549},
  {"start_time": "2032-06-01T00:00:00Z", "continuous_rate": 0.00904274},
  {"start_time": "2036-06-01T00:00:00Z", "continuous_rate": 0.00452137},
  {"start_time": "2040-06-01T00:00:00Z", "continuous_rate": 0.00226069},
  {"start_time": "2044-06-01T00:00:00Z", "continuous_rate": 0.00113034}
]
```

5.4. Execute next schedule
**eosio::execschedule** (no payload)
```
{}
```

5.5. Set MSIG execution time

**time.eosn::checktime**
```json
{
    "time": "2024-06-01T00:00:00.000Z"
}
```

5.5. Set `eosio.savings` ratio for Staking Rewards/ENF/Labs (53.71% / 29.55% / 16.74%)

**eosio.saving::setdistrib**
```json
[
  {"account": "eosio.reward", "percent": 5371},
  {"account": "eosio.grants", "percent": 2955},
  {"account": "eoslabs.io", "percent": 1674}
]
```

#### Configure System Fees
6.1 Set incoming fees to 100% go to REX via `donatetorex` strategy

**eosio.fees::setstrategy**
```json
{
    "strategy": "donatetorex",
    "weight": 10000
}
```
