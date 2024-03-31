import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Asset {
  'reward' : [] | [string],
  'titulo' : string,
  'autor' : Array<Principal>,
  'proyect_type' : ProjectType,
  'equityamountbytoken' : [] | [bigint],
  'project_start_date' : bigint,
  'project_end_date' : bigint,
  'small_description' : string,
  'end_crowfunding' : bigint,
  'business_plan_hash' : string,
  'price' : bigint,
  'asset_id' : bigint,
  'profit_per_token_percentage' : [] | [bigint],
  'token_hash' : string,
  'nftfractional' : bigint,
}
export type AssetError = { 'AlreadyVoted' : null } |
  { 'InvalidRating' : null } |
  { 'NoAssetsAssociated' : null } |
  { 'NotAllowed' : null } |
  { 'UpdateError' : null } |
  { 'AlreadyExist' : null } |
  { 'OutOfStock' : null } |
  { 'Unauthorized' : null } |
  { 'InvalidOwner' : null } |
  { 'NoVotes' : null } |
  { 'NotExist' : null };
export interface AssetInvest { 'investments' : Array<[Principal, string]> }
export interface CreateAsset {
  'reward' : [] | [string],
  'titulo' : string,
  'autor' : Array<Principal>,
  'proyect_type' : ProjectType,
  'equityamountbytoken' : [] | [bigint],
  'project_start_date' : bigint,
  'project_end_date' : bigint,
  'small_description' : string,
  'end_crowfunding' : bigint,
  'business_plan_hash' : string,
  'price' : bigint,
  'profit_per_token_percentage' : [] | [bigint],
  'token_hash' : string,
  'nftfractional' : bigint,
}
export interface KeyPrincipal { 'key' : Principal }
export interface OwnertoAsset {
  'assets_ids' : BigUint64Array | bigint[],
  'withaccounts' : Array<string>,
}
export interface PrincipalInvest { 'investments' : Array<[bigint, string]> }
export type ProjectType = { 'Loan' : null } |
  { 'Reward' : null } |
  { 'Donation' : null } |
  { 'Equity' : null };
export type Result = { 'Ok' : null } |
  { 'Err' : AssetError };
export type Result_asset = { 'Ok' : Asset } |
  { 'Err' : AssetError };
export type Result_asset_category = { 'Ok' : Array<[bigint, Asset]> } |
  { 'Err' : AssetError };
export type Result_asset_owner = { 'Ok' : Array<[bigint, Asset, string]> } |
  { 'Err' : AssetError };
export type Result_invest_principal = { 'Ok' : Array<[bigint, string]> } |
  { 'Err' : AssetError };
export type Result_investments_asset = { 'Ok' : Array<[string, string]> } |
  { 'Err' : AssetError };
export interface _SERVICE {
  'get_asset_by_id' : ActorMethod<[bigint], Result_asset>,
  'get_assets' : ActorMethod<[], Array<[bigint, Asset]>>,
  'get_assets_by_type' : ActorMethod<[ProjectType], Result_asset_category>,
  'get_assets_owner' : ActorMethod<[], Result_asset_owner>,
  'get_investments_by_asset' : ActorMethod<[bigint], Result_investments_asset>,
  'get_investments_by_principal' : ActorMethod<[], Result_invest_principal>,
  'save_invest_asset' : ActorMethod<[bigint, string], undefined>,
  'save_invest_user' : ActorMethod<[bigint, string], undefined>,
  'set_asset' : ActorMethod<[bigint, CreateAsset, string], Result>,
  'whoami' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
