export const idlFactory = ({ IDL }) => {
  const CreateProfile = IDL.Record({
    'about' : IDL.Text,
    'username' : IDL.Text,
    'profile_picture' : IDL.Text,
  });
  const ItemError = IDL.Variant({
    'AlreadyVoted' : IDL.Null,
    'InvalidRating' : IDL.Null,
    'ItemNotAllowed' : IDL.Null,
    'UpdateError' : IDL.Null,
    'AlreadyExist' : IDL.Null,
    'ItemNotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'InvalidOwner' : IDL.Null,
    'NoVotes' : IDL.Null,
    'NotExist' : IDL.Null,
    'NoItemsAssociated' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ItemError });
  const AddProfilePicture = IDL.Record({ 'profile_picture' : IDL.Text });
  const ResultSearch = IDL.Record({
    'matches' : IDL.Bool,
    'users' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal)),
  });
  const MensajeStatus = IDL.Variant({ 'Read' : IDL.Null, 'Sent' : IDL.Null });
  const Message = IDL.Record({
    'status' : MensajeStatus,
    'content' : IDL.Text,
    'time' : IDL.Nat64,
    'sender' : IDL.Opt(IDL.Principal),
    'addressee' : IDL.Opt(IDL.Principal),
  });
  const Conversation = IDL.Record({
    'other_user' : IDL.Principal,
    'last_message' : Message,
    'unread' : IDL.Bool,
    'unread_count' : IDL.Nat64,
  });
  const InboxResult = IDL.Record({ 'conversations' : IDL.Vec(Conversation) });
  const Result_get_inbox = IDL.Variant({
    'Ok' : InboxResult,
    'Err' : ItemError,
  });
  const Result_get_private_chat = IDL.Variant({
    'Ok' : IDL.Vec(Message),
    'Err' : ItemError,
  });
  const Profile = IDL.Record({
    'active' : IDL.Bool,
    'about' : IDL.Text,
    'username' : IDL.Text,
    'profile_picture' : IDL.Text,
    'last_connection' : IDL.Opt(IDL.Nat64),
  });
  const Result_get_profile = IDL.Variant({ 'Ok' : Profile, 'Err' : ItemError });
  const Result_get_tokens = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Text),
    'Err' : ItemError,
  });
  const Result_Bool = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : ItemError });
  const SendMessage = IDL.Record({
    'content' : IDL.Text,
    'addressee' : IDL.Principal,
  });
  const SendMessage2 = IDL.Record({
    'content' : IDL.Text,
    'addressee_text' : IDL.Text,
  });
  return IDL.Service({
    'activate_profile' : IDL.Func([], [Result], []),
    'add_picture' : IDL.Func([IDL.Nat64, AddProfilePicture], [Result], []),
    'add_token_to_principal' : IDL.Func([IDL.Text], [Result], []),
    'autocomplete_search' : IDL.Func([IDL.Text], [ResultSearch], ['query']),
    'create_profile' : IDL.Func([CreateProfile], [Result], []),
    'desactivate_profile' : IDL.Func([], [Result], []),
    'get_inbox' : IDL.Func([], [Result_get_inbox], ['query']),
    'get_private_chat' : IDL.Func(
        [IDL.Principal],
        [Result_get_private_chat],
        ['query'],
      ),
    'get_profile_key_by_principal' : IDL.Func(
        [IDL.Principal],
        [Result_get_profile],
        ['query'],
      ),
    'get_tokens_for_principal' : IDL.Func(
        [IDL.Text],
        [Result_get_tokens],
        ['query'],
      ),
    'get_user_profile' : IDL.Func([], [Result_get_profile], ['query']),
    'has_profile' : IDL.Func([], [IDL.Bool], ['query']),
    'is_active' : IDL.Func([IDL.Principal], [Result_Bool], ['query']),
    'manager' : IDL.Func([], [IDL.Principal], ['query']),
    'mark_messages_as_read' : IDL.Func([IDL.Principal], [Result], []),
    'send_message' : IDL.Func([SendMessage], [Result], []),
    'send_message_2' : IDL.Func([SendMessage2], [Result], []),
    'send_message_by_canister' : IDL.Func([SendMessage], [Result], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => {
  const CreateProfile = IDL.Record({
    'about' : IDL.Text,
    'username' : IDL.Text,
    'profile_picture' : IDL.Text,
  });
  return [CreateProfile];
};
