export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get_items' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'remove_item' : IDL.Func([IDL.Text], [], []),
    'set_item' : IDL.Func([IDL.Text, IDL.Nat], [], []),
  });
};
export const init = ({ IDL }) => { return [IDL.Opt(IDL.Text)]; };
