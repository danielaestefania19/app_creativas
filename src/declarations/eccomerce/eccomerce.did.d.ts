import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CreateItem {
  'item' : string,
  'description' : string,
  'price' : bigint,
}
export interface Item {
  'owner' : [] | [Principal],
  'item' : string,
  'description' : string,
  'rating' : [] | [Rating],
  'price' : bigint,
}
export type ItemError = { 'ItemNotAllowed' : null } |
  { 'UpdateError' : null } |
  { 'AlreadyExist' : null } |
  { 'Unauthorized' : null } |
  { 'NotExist' : null } |
  { 'NoItemsAssociated' : null };
export type Rating = { 'one' : null } |
  { 'two' : null } |
  { 'three' : null } |
  { 'five' : null } |
  { 'four' : null } |
  { 'zero' : null };
export type Result = { 'Ok' : null } |
  { 'Err' : ItemError };
export type ResultItems = { 'Ok' : Array<[bigint, Item]> } |
  { 'Err' : ItemError };
export interface _SERVICE {
  'get_items' : ActorMethod<[], Array<[bigint, Item]>>,
  'get_items_owner' : ActorMethod<[], ResultItems>,
  'remove_item' : ActorMethod<[bigint], Result>,
  'set_item' : ActorMethod<[CreateItem], undefined>,
  'update_item' : ActorMethod<[bigint, CreateItem], Result>,
  'whoami' : ActorMethod<[], Principal>,
}
