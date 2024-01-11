export const idlFactory = ({ IDL }) => {
  const Rating = IDL.Variant({
    'one' : IDL.Null,
    'two' : IDL.Null,
    'three' : IDL.Null,
    'five' : IDL.Null,
    'four' : IDL.Null,
    'zero' : IDL.Null,
  });
  const Item = IDL.Record({
    'owner' : IDL.Opt(IDL.Principal),
    'item' : IDL.Text,
    'description' : IDL.Text,
    'rating' : IDL.Opt(Rating),
    'price' : IDL.Nat64,
  });
  const ItemError = IDL.Variant({
    'ItemNotAllowed' : IDL.Null,
    'UpdateError' : IDL.Null,
    'AlreadyExist' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'NotExist' : IDL.Null,
    'NoItemsAssociated' : IDL.Null,
  });
  const ResultItems = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, Item)),
    'Err' : ItemError,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ItemError });
  const CreateItem = IDL.Record({
    'item' : IDL.Text,
    'description' : IDL.Text,
    'price' : IDL.Nat64,
  });
  return IDL.Service({
    'get_items' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat64, Item))],
        ['query'],
      ),
    'get_items_owner' : IDL.Func([], [ResultItems], ['query']),
    'remove_item' : IDL.Func([IDL.Nat64], [Result], []),
    'set_item' : IDL.Func([CreateItem], [], []),
    'update_item' : IDL.Func([IDL.Nat64, CreateItem], [Result], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => { return [IDL.Opt(IDL.Text)]; };
