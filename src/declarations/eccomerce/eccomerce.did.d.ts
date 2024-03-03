import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

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
export interface Conversation {
  'other_user' : Principal,
  'last_message' : Message,
  'unread' : boolean,
  'unread_count' : bigint,
}
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
export interface CreateProfile {
  'about' : string,
  'username' : string,
  'profile_picture' : string,
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
export interface InboxResult { 'conversations' : Array<Conversation> }
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
  { 'Unauthorized' : null } |
  { 'InvalidOwner' : null } |
  { 'NoVotes' : null } |
  { 'NotExist' : null } |
  { 'NoItemsAssociated' : null };
export interface KeyPrincipal { 'key' : Principal }
export interface LastChecked { 'key' : Principal }
export type MensajeStatus = { 'Read' : null } |
  { 'Sent' : null };
export interface Message {
  'status' : MensajeStatus,
  'content' : string,
  'time' : bigint,
  'sender' : [] | [Principal],
  'addressee' : [] | [Principal],
}
export interface OwnerItemCard { 'owner' : Principal, 'item' : bigint }
export interface Profile {
  'active' : boolean,
  'about' : string,
  'username' : string,
  'profile_picture' : string,
  'last_connection' : [] | [bigint],
}
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
export interface ResultSearch {
  'matches' : boolean,
  'users' : Array<[string, Principal]>,
}
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
export type Result_get_inbox = { 'Ok' : InboxResult } |
  { 'Err' : ItemError };
export type Result_get_len_card = { 'Ok' : bigint } |
  { 'Err' : ItemError };
export type Result_get_owner = { 'Ok' : Principal } |
  { 'Err' : ItemError };
export type Result_get_private_chat = { 'Ok' : Array<Message> } |
  { 'Err' : ItemError };
export type Result_get_profile = { 'Ok' : Profile } |
  { 'Err' : ItemError };
export type Result_get_purchases = { 'Ok' : Array<Purchase> } |
  { 'Err' : ItemError };
export type Result_get_tokens = { 'Ok' : Array<string> } |
  { 'Err' : ItemError };
export type Result_get_user_card = { 'Ok' : ShippingCard } |
  { 'Err' : ItemError };
export interface Review {
  'review' : string,
  'rating' : Rating,
  'reviewer' : [] | [Principal],
}
export interface SendMessage { 'content' : string, 'addressee' : Principal }
export interface SendMessage2 { 'content' : string, 'addressee_text' : string }
export interface ShippingCard { 'card' : Array<Card>, 'total_price' : bigint }
<<<<<<< HEAD
export type UpdateAction = { 'Add' : null } |
  { 'Remove' : null };
=======
>>>>>>> 19d1c5e665bb0208a3287d46e8c72409313bced4
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
export interface UserMessages {
  'messages' : Array<Message>,
  'unread' : bigint,
  'last_checked' : bigint,
}
export interface Vote { 'voter' : Principal, 'rating' : Rating }
export interface _SERVICE {
  'activate_profile' : ActorMethod<[], Result>,
  'add_item_card' : ActorMethod<[AddItem], Result>,
  'add_picture' : ActorMethod<[bigint, AddProfilePicture], Result>,
  'add_review' : ActorMethod<[CreateReview], Result>,
  'add_token_to_principal' : ActorMethod<[string], Result>,
  'associate_address' : ActorMethod<[CreateUserAddress], undefined>,
  'autocomplete_search' : ActorMethod<[string], ResultSearch>,
  'clear_cart' : ActorMethod<[], Result>,
  'create_profile' : ActorMethod<[CreateProfile], Result>,
  'create_purchase' : ActorMethod<[CreatePurchase], Result>,
  'desactivate_profile' : ActorMethod<[], Result>,
  'get_address_by_id' : ActorMethod<[bigint], Result_get_address_by_id>,
  'get_contract_address' : ActorMethod<[bigint], Result_get>,
  'get_inbox' : ActorMethod<[], Result_get_inbox>,
  'get_item_billing_address' : ActorMethod<[bigint], Result_get>,
  'get_item_owner' : ActorMethod<[bigint], Result_get_owner>,
  'get_items' : ActorMethod<[], Array<[bigint, Item]>>,
  'get_items_by_category' : ActorMethod<[string], Result_get_category>,
  'get_items_owner' : ActorMethod<[], ResultItems>,
  'get_private_chat' : ActorMethod<[Principal], Result_get_private_chat>,
  'get_profile_key_by_principal' : ActorMethod<[Principal], Result_get_profile>,
  'get_tokens_for_principal' : ActorMethod<[string], Result_get_tokens>,
  'get_total_items_in_cart' : ActorMethod<[], Result_get_len_card>,
  'get_total_price' : ActorMethod<[], Result_get_len_card>,
  'get_user_addresses' : ActorMethod<[], Result_get_address>,
  'get_user_cart' : ActorMethod<[], Result_get_user_card>,
  'get_user_profile' : ActorMethod<[], Result_get_profile>,
  'get_your_purchases' : ActorMethod<[], Result_get_purchases>,
  'get_your_sales' : ActorMethod<[], Result_get_purchases>,
  'has_profile' : ActorMethod<[], boolean>,
  'is_active' : ActorMethod<[Principal], Result_Bool>,
  'item_in_cart' : ActorMethod<[Principal, bigint], boolean>,
  'manager' : ActorMethod<[], Principal>,
  'mark_messages_as_read' : ActorMethod<[Principal], Result>,
  'remove_item' : ActorMethod<[bigint], Result>,
  'remove_item_from_cart' : ActorMethod<[bigint], Result>,
  'send_message' : ActorMethod<[SendMessage], Result>,
  'send_message_2' : ActorMethod<[SendMessage2], Result>,
  'send_message_by_canister' : ActorMethod<[SendMessage], Result>,
  'set_item' : ActorMethod<[CreateItem], Result>,
  'update_address' : ActorMethod<[bigint, UserAddressEdit], Result>,
  'update_item' : ActorMethod<[bigint, UpdateItem], Result>,
  'update_item_card' : ActorMethod<[AddItem, string], Result>,
  'whoami' : ActorMethod<[], Principal>,
}
