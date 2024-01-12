import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Item {
  'item' : string,
  'description' : string,
  'price' : bigint,
}
export interface _SERVICE {
  'get_items' : ActorMethod<[], Array<[bigint, Item]>>,
  'remove_item' : ActorMethod<[bigint], undefined>,
  'set_item' : ActorMethod<[bigint, Item], undefined>,
  'whoami' : ActorMethod<[], Principal>,
}
