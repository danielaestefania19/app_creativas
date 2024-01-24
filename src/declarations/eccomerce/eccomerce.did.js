export const idlFactory = ({ IDL }) => {
  const Rating = IDL.Variant({
    'One' : IDL.Null,
    'Two' : IDL.Null,
    'Five' : IDL.Null,
    'Four' : IDL.Null,
    'Zero' : IDL.Null,
    'Three' : IDL.Null,
  });
  const Item = IDL.Record({
    'owner' : IDL.Opt(IDL.Principal),
    'item' : IDL.Text,
    'ratings' : IDL.Vec(IDL.Tuple(IDL.Opt(IDL.Principal), Rating)),
    'description' : IDL.Text,
    'rating' : IDL.Opt(Rating),
    'image' : IDL.Text,
    'price' : IDL.Nat64,
  });
  const ItemError = IDL.Variant({
    'AlreadyVoted' : IDL.Null,
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
  const ResultItems = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, Item)),
    'Err' : ItemError,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ItemError });
  const CreateItem = IDL.Record({
    'owner' : IDL.Text,
    'item' : IDL.Text,
    'description' : IDL.Text,
    'image' : IDL.Text,
    'price' : IDL.Nat64,
  });
  return IDL.Service({
    'get_items' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat64, Item))],
        ['query'],
      ),
    'get_items_owner' : IDL.Func([IDL.Text], [ResultItems], ['query']),
    'remove_item' : IDL.Func([IDL.Nat64, IDL.Text], [Result], []),
    'set_item' : IDL.Func([CreateItem], [], []),
    'update_item' : IDL.Func([IDL.Nat64, CreateItem], [Result], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => { return [IDL.Opt(IDL.Text)]; };
