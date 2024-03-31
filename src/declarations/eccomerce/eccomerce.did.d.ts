import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AddItem { 'item' : bigint, 'amount' : bigint }
export interface AddProfilePicture { 'profile_picture' : string }
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
export interface BoolStorable { 'bool' : boolean }
export interface Card { 'item' : Item, 'amount' : bigint, 'item_id' : bigint }
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
export interface CreateReview {
  'review' : string,
  'rating' : bigint,
  'item_id' : bigint,
}
export interface CreateUserAddress { 'address' : Address }
export interface Item {
  'reviews' : Array<Review>,
  'owner' : [] | [Principal],
  'billing_address' : string,
  'item' : string,
  'description' : string,
  'stock' : bigint,
  'category' : Category,
  'image' : string,
  'contract_address' : string,
  'price' : bigint,
}
export type ItemError = { 'AlreadyVoted' : null } |
  { 'InvalidRating' : null } |
  { 'ItemNotAllowed' : null } |
  { 'UpdateError' : null } |
  { 'AlreadyExist' : null } |
  { 'ItemNotFound' : null } |
  { 'OutOfStock' : null } |
  { 'Unauthorized' : null } |
  { 'InvalidOwner' : null } |
  { 'NoVotes' : null } |
  { 'NotExist' : null } |
  { 'NoItemsAssociated' : null };
export interface KeyPrincipal { 'key' : Principal }
export interface OwnerItemCard { 'owner' : Principal, 'item' : bigint }
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
export type Result_Bool = { 'Ok' : boolean } |
  { 'Err' : ItemError };
export type Result_get = { 'Ok' : string } |
  { 'Err' : ItemError };
export type Result_get_address = { 'Ok' : Array<[bigint, Address]> } |
  { 'Err' : ItemError };
export type Result_get_address_by_id = { 'Ok' : [] | [Address] } |
  { 'Err' : ItemError };
export type Result_get_category = { 'Ok' : Array<[bigint, Item]> } |
  { 'Err' : ItemError };
export type Result_get_len_card = { 'Ok' : bigint } |
  { 'Err' : ItemError };
export type Result_get_owner = { 'Ok' : Principal } |
  { 'Err' : ItemError };
export type Result_get_purchases = { 'Ok' : Array<Purchase> } |
  { 'Err' : ItemError };
export type Result_get_user_card = { 'Ok' : ShippingCard } |
  { 'Err' : ItemError };
export type Result_item = { 'Ok' : Item } |
  { 'Err' : ItemError };
export interface Review {
  'review' : string,
  'rating' : Rating,
  'reviewer' : [] | [Principal],
}
export interface ShippingCard { 'card' : Array<Card>, 'total_price' : bigint }
export type UpdateAction = { 'Add' : null } |
  { 'Remove' : null };
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
  'add_item_card' : ActorMethod<[AddItem], Result>,
  'add_picture' : ActorMethod<[bigint, AddProfilePicture], Result>,
  'add_review' : ActorMethod<[CreateReview], Result>,
  'associate_address' : ActorMethod<[CreateUserAddress], undefined>,
  'clear_cart' : ActorMethod<[], Result>,
  'create_purchase' : ActorMethod<[CreatePurchase], Result>,
  'get_address_by_id' : ActorMethod<[bigint], Result_get_address_by_id>,
  'get_contract_address' : ActorMethod<[bigint], Result_get>,
  'get_item' : ActorMethod<[bigint], Result_item>,
  'get_item_billing_address' : ActorMethod<[bigint], Result_get>,
  'get_item_owner' : ActorMethod<[bigint], Result_get_owner>,
  'get_items' : ActorMethod<[], Array<[bigint, Item]>>,
  'get_items_by_category' : ActorMethod<[string], Result_get_category>,
  'get_items_owner' : ActorMethod<[], ResultItems>,
  'get_total_items_in_cart' : ActorMethod<[], Result_get_len_card>,
  'get_total_price' : ActorMethod<[], Result_get_len_card>,
  'get_user_addresses' : ActorMethod<[], Result_get_address>,
  'get_user_cart' : ActorMethod<[], Result_get_user_card>,
  'get_your_purchases' : ActorMethod<[], Result_get_purchases>,
  'get_your_sales' : ActorMethod<[], Result_get_purchases>,
  'item_in_cart' : ActorMethod<[Principal, bigint], boolean>,
  'manager' : ActorMethod<[], Principal>,
  'remove_item' : ActorMethod<[bigint], Result>,
  'remove_item_from_cart' : ActorMethod<[bigint], Result>,
  'set_item' : ActorMethod<[CreateItem], Result>,
  'update_address' : ActorMethod<[bigint, UserAddressEdit], Result>,
  'update_item' : ActorMethod<[bigint, UpdateItem], Result>,
  'update_item_card' : ActorMethod<[AddItem, string], Result>,
  'whoami' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
