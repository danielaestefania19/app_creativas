import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CreateItem {
  'owner' : string,
  'item' : string,
  'description' : string,
  'image' : string,
  'contract_address' : string,
  'price' : bigint,
}
export interface Item {
  'owner' : [] | [Principal],
  'item' : string,
  'description' : string,
  'rating' : [] | [Rating],
  'image' : string,
  'contract_address' : string,
  'price' : bigint,
}
export type ItemError = { 'AlreadyVoted' : null } |
  { 'ItemNotAllowed' : null } |
  { 'UpdateError' : null } |
  { 'AlreadyExist' : null } |
  { 'ItemNotFound' : null } |
  { 'Unauthorized' : null } |
  { 'InvalidOwner' : null } |
  { 'NoVotes' : null } |
  { 'NotExist' : null } |
  { 'NoItemsAssociated' : null };
export type Rating = { 'One' : null } |
  { 'Two' : null } |
  { 'Five' : null } |
  { 'Four' : null } |
  { 'Zero' : null } |
  { 'Three' : null };
export type Result = { 'Ok' : null } |
  { 'Err' : ItemError };
export type ResultItems = { 'Ok' : Array<[bigint, Item]> } |
  { 'Err' : ItemError };
export interface Vote { 'voter' : Principal, 'rating' : Rating }
export interface _SERVICE {
  'get_items' : ActorMethod<[], Array<[bigint, Item]>>,
  'get_items_owner' : ActorMethod<[string], ResultItems>,
  'remove_item' : ActorMethod<[bigint, string], Result>,
  'set_item' : ActorMethod<[CreateItem], undefined>,
  'update_item' : ActorMethod<[bigint, CreateItem], Result>,
  'whoami' : ActorMethod<[], Principal>,
}
