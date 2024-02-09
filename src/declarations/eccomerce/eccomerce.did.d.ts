import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Address {
  'country' : string,
  'city' : string,
  'postal_code' : string,
  'state' : string,
  'address' : string,
  'phone_number' : string,
}
export interface AddressEdit {
  'country' : [] | [string],
  'city' : [] | [string],
  'postal_code' : [] | [string],
  'state' : [] | [string],
  'address' : [] | [string],
  'phone_number' : [] | [string],
}
export type Category = { 'Baby' : null } |
  { 'ClothingShoesAccessories' : null } |
  { 'HomeKitchen' : null } |
  { 'Books' : null } |
  { 'PetsAccessories' : null } |
  { 'BeautyPersonalCare' : null } |
  { 'Electronics' : null } |
  { 'SportsOutdoor' : null } |
  { 'FoodBeverages' : null } |
  { 'HomeImprovement' : null };
export interface CreateItem {
  'billing_address' : string,
  'item' : string,
  'description' : string,
  'stock' : bigint,
  'category' : string,
  'image' : string,
  'contract_address' : string,
  'price' : bigint,
}
export interface CreatePurchase {
  'id_shipping_address' : bigint,
  'name' : string,
  'account_buyer' : string,
  'payment_id' : bigint,
  'amount' : bigint,
  'item_id' : bigint,
  'lastname' : string,
}
export interface CreateUserAddress { 'address' : Address }
export interface Item {
  'owner' : [] | [Principal],
  'billing_address' : string,
  'item' : string,
  'description' : string,
  'stock' : bigint,
  'category' : Category,
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
export interface Purchase {
  'status' : PurchaseStatus,
  'name' : string,
  'shipping_address' : Address,
  'account_seller' : string,
  'seller' : [] | [Principal],
  'account_buyer' : string,
  'buyer' : [] | [Principal],
  'contract_address' : string,
  'payment_id' : bigint,
  'amount' : bigint,
  'item_id' : bigint,
  'lastname' : string,
}
export type PurchaseStatus = { 'Started' : null } |
  { 'Disputed' : null } |
  { 'Refunded' : null } |
  { 'Paid' : null } |
  { 'Delivered' : null } |
  { 'Shipped' : null } |
  { 'Completed' : null };
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
export type Result_get = { 'Ok' : string } |
  { 'Err' : ItemError };
export type Result_get_address = { 'Ok' : Array<[bigint, Address]> } |
  { 'Err' : ItemError };
export type Result_get_address_by_id = { 'Ok' : [] | [Address] } |
  { 'Err' : ItemError };
export type Result_get_owner = { 'Ok' : Principal } |
  { 'Err' : ItemError };
export interface UpdateItem {
  'description' : [] | [string],
  'stock' : [] | [bigint],
  'image' : [] | [string],
  'price' : [] | [bigint],
}
export interface UserAddress {
  'address_user' : [] | [Principal],
  'addresses' : [] | [Array<Address>],
}
export interface UserAddressEdit { 'address' : AddressEdit }
export interface Vote { 'voter' : Principal, 'rating' : Rating }
export interface _SERVICE {
  'associate_address' : ActorMethod<[CreateUserAddress], undefined>,
  'create_purchase' : ActorMethod<[CreatePurchase], Result>,
  'get_address_by_id' : ActorMethod<[bigint], Result_get_address_by_id>,
  'get_contract_address' : ActorMethod<[bigint], Result_get>,
  'get_item_billing_address' : ActorMethod<[bigint], Result_get>,
  'get_item_owner' : ActorMethod<[bigint], Result_get_owner>,
  'get_items' : ActorMethod<[], Array<[bigint, Item]>>,
  'get_items_owner' : ActorMethod<[], ResultItems>,
  'get_user_addresses' : ActorMethod<[], Result_get_address>,
  'remove_item' : ActorMethod<[bigint], Result>,
  'set_item' : ActorMethod<[CreateItem], Result>,
  'update_address' : ActorMethod<[bigint, UserAddressEdit], Result>,
  'update_item' : ActorMethod<[bigint, UpdateItem], Result>,
  'whoami' : ActorMethod<[], Principal>,
}
