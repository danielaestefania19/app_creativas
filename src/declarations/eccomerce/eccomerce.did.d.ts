import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'get_items' : ActorMethod<[], Array<[string, bigint]>>,
  'remove_item' : ActorMethod<[string], undefined>,
  'set_item' : ActorMethod<[string, bigint], undefined>,
}
