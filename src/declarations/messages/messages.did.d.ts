import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AddProfilePicture { 'profile_picture' : string }
export interface Conversation {
  'other_user' : Principal,
  'last_message' : Message,
  'unread' : boolean,
  'unread_count' : bigint,
}
export interface CreateProfile {
  'about' : string,
  'username' : string,
  'profile_picture' : string,
}
export interface InboxResult { 'conversations' : Array<Conversation> }
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
export interface Profile {
  'active' : boolean,
  'about' : string,
  'username' : string,
  'profile_picture' : string,
  'last_connection' : [] | [bigint],
}
export type Result = { 'Ok' : null } |
  { 'Err' : ItemError };
export interface ResultSearch {
  'matches' : boolean,
  'users' : Array<[string, Principal]>,
}
export type Result_Bool = { 'Ok' : boolean } |
  { 'Err' : ItemError };
export type Result_get_inbox = { 'Ok' : InboxResult } |
  { 'Err' : ItemError };
export type Result_get_private_chat = { 'Ok' : Array<Message> } |
  { 'Err' : ItemError };
export type Result_get_profile = { 'Ok' : Profile } |
  { 'Err' : ItemError };
export type Result_get_tokens = { 'Ok' : Array<string> } |
  { 'Err' : ItemError };
export interface SendMessage { 'content' : string, 'addressee' : Principal }
export interface SendMessage2 { 'content' : string, 'addressee_text' : string }
export interface UserMessages {
  'messages' : Array<Message>,
  'unread' : bigint,
  'last_checked' : bigint,
}
export interface _SERVICE {
  'activate_profile' : ActorMethod<[], Result>,
  'add_picture' : ActorMethod<[bigint, AddProfilePicture], Result>,
  'add_token_to_principal' : ActorMethod<[string], Result>,
  'autocomplete_search' : ActorMethod<[string], ResultSearch>,
  'create_profile' : ActorMethod<[CreateProfile], Result>,
  'desactivate_profile' : ActorMethod<[], Result>,
  'get_inbox' : ActorMethod<[], Result_get_inbox>,
  'get_private_chat' : ActorMethod<[Principal], Result_get_private_chat>,
  'get_profile_key_by_principal' : ActorMethod<[Principal], Result_get_profile>,
  'get_tokens_for_principal' : ActorMethod<[string], Result_get_tokens>,
  'get_user_profile' : ActorMethod<[], Result_get_profile>,
  'has_profile' : ActorMethod<[], boolean>,
  'is_active' : ActorMethod<[Principal], Result_Bool>,
  'manager' : ActorMethod<[], Principal>,
  'mark_messages_as_read' : ActorMethod<[Principal], Result>,
  'send_message' : ActorMethod<[SendMessage], Result>,
  'send_message_2' : ActorMethod<[SendMessage2], Result>,
  'send_message_by_canister' : ActorMethod<[SendMessage], Result>,
  'whoami' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
