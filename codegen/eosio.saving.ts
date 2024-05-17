import type {Action, NameType, UInt16Type} from '@wharfkit/antelope'
import {ABI, Asset, Blob, Name, Struct, UInt16} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yAAUFY2xhaW0AAQdjbGFpbWVyBG5hbWUMY2xhaW1lcnNfcm93AAIHYWNjb3VudARuYW1lB2JhbGFuY2UFYXNzZXQKY29uZmlnX3JvdwABCGFjY291bnRzFGRpc3RyaWJ1dGVfYWNjb3VudFtdEmRpc3RyaWJ1dGVfYWNjb3VudAACB2FjY291bnQEbmFtZQdwZXJjZW50BnVpbnQxNgpzZXRkaXN0cmliAAEIYWNjb3VudHMUZGlzdHJpYnV0ZV9hY2NvdW50W10CAAAAAADpTEQFY2xhaW2MAi0tLQpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGNsYWltCnN1bW1hcnk6IHt7Y2xhaW1lcn19IGNsYWltIHRva2VucyB0aGF0IGhhdmUgYmVlbiBtYXJrZWQgZm9yIGRpc3RyaWJ1dGlvbi4KaWNvbjogaHR0cHM6Ly9nYXRld2F5LnBpbmF0YS5jbG91ZC9pcGZzL1FtTnV1bjVRVDNFRWZYQmZoeGdERlJnU2FEWnM1cHI3MXZTdzd6ckFldXVXOE0jNWRmYWQwZGY3Mjc3MmVlMWNjYzE1NWU2NzBjMWQxMjRmNWM1MTIyZjFkNTAyNzU2NWRmMzhiNDE4MDQyZDFkZAotLS0AwHE3Y5eywgpzZXRkaXN0cmlikQItLS0Kc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBzZXRkaXN0cmliCnN1bW1hcnk6IFNldCB0aGUgYWNjb3VudHMgYW5kIHRoZWlyIHBlcmNlbnRhZ2Ugb2YgdGhlIGRpc3RyaWJ1dGVkIHRva2Vucy4KaWNvbjogaHR0cHM6Ly9nYXRld2F5LnBpbmF0YS5jbG91ZC9pcGZzL1FtTnV1bjVRVDNFRWZYQmZoeGdERlJnU2FEWnM1cHI3MXZTdzd6ckFldXVXOE0jNWRmYWQwZGY3Mjc3MmVlMWNjYzE1NWU2NzBjMWQxMjRmNWM1MTIyZjFkNTAyNzU2NWRmMzhiNDE4MDQyZDFkZAotLS0CAAAA+CrpTEQDaTY0AAAMY2xhaW1lcnNfcm93AAAAADC3JkUDaTY0AAAKY29uZmlnX3JvdwAAAAAA'
)
export const abi = ABI.from(abiBlob)
export namespace Types {
    @Struct.type('claim')
    export class claim extends Struct {
        @Struct.field(Name)
        claimer!: Name
    }
    @Struct.type('claimers_row')
    export class claimers_row extends Struct {
        @Struct.field(Name)
        account!: Name
        @Struct.field(Asset)
        balance!: Asset
    }
    @Struct.type('distribute_account')
    export class distribute_account extends Struct {
        @Struct.field(Name)
        account!: Name
        @Struct.field(UInt16)
        percent!: UInt16
    }
    @Struct.type('config_row')
    export class config_row extends Struct {
        @Struct.field(distribute_account, {array: true})
        accounts!: distribute_account[]
    }
    @Struct.type('setdistrib')
    export class setdistrib extends Struct {
        @Struct.field(distribute_account, {array: true})
        accounts!: distribute_account[]
    }
}
export const TableMap = {
    claimers: Types.claimers_row,
    config: Types.config_row,
}
export interface TableTypes {
    claimers: Types.claimers_row
    config: Types.config_row
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type TableNames = keyof TableTypes
export namespace ActionParams {
    export namespace Type {
        export interface distribute_account {
            account: NameType
            percent: UInt16Type
        }
    }
    export interface claim {
        claimer: NameType
    }
    export interface setdistrib {
        accounts: Type.distribute_account[]
    }
}
export interface ActionNameParams {
    claim: ActionParams.claim
    setdistrib: ActionParams.setdistrib
}
export type ActionNames = keyof ActionNameParams
export class Contract extends BaseContract {
    constructor(args: PartialBy<ContractArgs, 'abi' | 'account'>) {
        super({
            client: args.client,
            abi: abi,
            account: args.account || Name.from('eosio.saving'),
        })
    }
    action<T extends ActionNames>(
        name: T,
        data: ActionNameParams[T],
        options?: ActionOptions
    ): Action {
        return super.action(name, data, options)
    }
    table<T extends TableNames>(name: T, scope?: NameType): Table<RowType<T>> {
        return super.table(name, scope, TableMap[name])
    }
}
