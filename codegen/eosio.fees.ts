import type {Action, NameType, UInt16Type, UInt32Type} from '@wharfkit/antelope'
import {ABI, Blob, Name, Struct, TimePointSec, UInt16, UInt32} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yAAYLZGVsc3RyYXRlZ3kAAQhzdHJhdGVneQRuYW1lCmRpc3RyaWJ1dGUAAARpbml0AAEMZXBvY2hfcGVyaW9kBnVpbnQzMgtzZXRzdHJhdGVneQACCHN0cmF0ZWd5BG5hbWUGd2VpZ2h0BnVpbnQxNgxzZXR0aW5nc19yb3cAAhNlcG9jaF90aW1lX2ludGVydmFsBnVpbnQzMhRuZXh0X2Vwb2NoX3RpbWVzdGFtcA50aW1lX3BvaW50X3NlYw5zdHJhdGVnaWVzX3JvdwACCHN0cmF0ZWd5BG5hbWUGd2VpZ2h0BnVpbnQxNgQAPFPZ3IyjSgtkZWxzdHJhdGVned8BLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogZGVsc3RyYXRlZ3kKc3VtbWFyeTogJ2RlbHN0cmF0ZWd5JwppY29uOiBodHRwczovL2dhdGV3YXkucGluYXRhLmNsb3VkL2lwZnMvUW1aNEhTWkR1U3JaNEJIYXd0WlJoVmZ3eVlKNERlcE5KcVZEenhZNTlLdmVpTSMzODMwZjFjZThjYjA3Zjc3NTdkYmNmMzgzYjFlYzFiMTE5MTRhYzM0YTFmOWQ4YjA2NWYwNzYwMGZhOWRhYzE5Ci0tLQCAyvq4m7FLCmRpc3RyaWJ1dGWWAi0tLQpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IERpc3RyaWJ1dGUKc3VtbWFyeTogJ2Rpc3RyaWJ1dGUnCmljb246IGh0dHBzOi8vZ2F0ZXdheS5waW5hdGEuY2xvdWQvaXBmcy9RbVo0SFNaRHVTclo0Qkhhd3RaUmhWZnd5WUo0RGVwTkpxVkR6eFk1OUt2ZWlNIzM4MzBmMWNlOGNiMDdmNzc1N2RiY2YzODNiMWVjMWIxMTkxNGFjMzRhMWY5ZDhiMDY1ZjA3NjAwZmE5ZGFjMTkKLS0tCgpEaXN0cmlidXRlIHRoZSBzeXN0ZW0gZmVlIHRvIHRoZSBjb3JyZXNwb25kaW5nIGFjY291bnQuAAAAAACQ3XQEaW5pdNEBLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogaW5pdApzdW1tYXJ5OiAnaW5pdCcKaWNvbjogaHR0cHM6Ly9nYXRld2F5LnBpbmF0YS5jbG91ZC9pcGZzL1FtWjRIU1pEdVNyWjRCSGF3dFpSaFZmd3lZSjREZXBOSnFWRHp4WTU5S3ZlaU0jMzgzMGYxY2U4Y2IwN2Y3NzU3ZGJjZjM4M2IxZWMxYjExOTE0YWMzNGExZjlkOGIwNjVmMDc2MDBmYTlkYWMxOQotLS0APFPZ3IyzwgtzZXRzdHJhdGVned8BLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogc2V0c3RyYXRlZ3kKc3VtbWFyeTogJ3NldHN0cmF0ZWd5JwppY29uOiBodHRwczovL2dhdGV3YXkucGluYXRhLmNsb3VkL2lwZnMvUW1aNEhTWkR1U3JaNEJIYXd0WlJoVmZ3eVlKNERlcE5KcVZEenhZNTlLdmVpTSMzODMwZjFjZThjYjA3Zjc3NTdkYmNmMzgzYjFlYzFiMTE5MTRhYzM0YTFmOWQ4YjA2NWYwNzYwMGZhOWRhYzE5Ci0tLQIAAACYTZezwgNpNjQAAAxzZXR0aW5nc19yb3cAAFaOqWxuxgNpNjQAAA5zdHJhdGVnaWVzX3JvdwENVXNlckFncmVlbWVudDpUaGUgYGVvc2lvLmZlZXNgIGNvbnRyYWN0IGhhbmRsZXMgc3lzdGVtIGZlZSBkaXN0cmlidXRpb24uAAAAAA=='
)
export const abi = ABI.from(abiBlob)
export namespace Types {
    @Struct.type('delstrategy')
    export class delstrategy extends Struct {
        @Struct.field(Name)
        strategy!: Name
    }
    @Struct.type('distribute')
    export class distribute extends Struct {}
    @Struct.type('init')
    export class init extends Struct {
        @Struct.field(UInt32)
        epoch_period!: UInt32
    }
    @Struct.type('setstrategy')
    export class setstrategy extends Struct {
        @Struct.field(Name)
        strategy!: Name
        @Struct.field(UInt16)
        weight!: UInt16
    }
    @Struct.type('settings_row')
    export class settings_row extends Struct {
        @Struct.field(UInt32)
        epoch_time_interval!: UInt32
        @Struct.field(TimePointSec)
        next_epoch_timestamp!: TimePointSec
    }
    @Struct.type('strategies_row')
    export class strategies_row extends Struct {
        @Struct.field(Name)
        strategy!: Name
        @Struct.field(UInt16)
        weight!: UInt16
    }
}
export const TableMap = {
    settings: Types.settings_row,
    strategies: Types.strategies_row,
}
export interface TableTypes {
    settings: Types.settings_row
    strategies: Types.strategies_row
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type TableNames = keyof TableTypes
export namespace ActionParams {
    export namespace Type {}
    export interface delstrategy {
        strategy: NameType
    }
    export interface distribute {}
    export interface init {
        epoch_period: UInt32Type
    }
    export interface setstrategy {
        strategy: NameType
        weight: UInt16Type
    }
}
export interface ActionNameParams {
    delstrategy: ActionParams.delstrategy
    distribute: ActionParams.distribute
    init: ActionParams.init
    setstrategy: ActionParams.setstrategy
}
export type ActionNames = keyof ActionNameParams
export class Contract extends BaseContract {
    constructor(args: PartialBy<ContractArgs, 'abi' | 'account'>) {
        super({
            client: args.client,
            abi: abi,
            account: args.account || Name.from('eosio.fees'),
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
