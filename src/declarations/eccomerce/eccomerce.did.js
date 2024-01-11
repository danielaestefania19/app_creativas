export const idlFactory = ({ IDL }) => {
  const Item = IDL.Record({
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
    'remove_item' : IDL.Func([IDL.Nat64], [], []),
    'set_item' : IDL.Func([IDL.Nat64, Item], [], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => { return [IDL.Opt(IDL.Text)]; };
