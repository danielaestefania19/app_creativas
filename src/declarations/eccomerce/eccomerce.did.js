export const idlFactory = ({ IDL }) => {
  const Address = IDL.Record({
    'country' : IDL.Text,
    'city' : IDL.Text,
    'postal_code' : IDL.Text,
    'state' : IDL.Text,
    'address' : IDL.Text,
    'phone_number' : IDL.Text,
  });
  const CreateUserAddress = IDL.Record({ 'address' : Address });
  const CreatePurchase = IDL.Record({
    'id_shipping_address' : IDL.Nat64,
    'name' : IDL.Text,
    'account_buyer' : IDL.Text,
    'payment_id' : IDL.Nat64,
    'amount' : IDL.Nat64,
    'item_id' : IDL.Nat64,
    'lastname' : IDL.Text,
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
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ItemError });
  const Result_get_address_by_id = IDL.Variant({
    'Ok' : IDL.Opt(Address),
    'Err' : ItemError,
  });
  const Result_get = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : ItemError });
  const Result_get_owner = IDL.Variant({
    'Ok' : IDL.Principal,
    'Err' : ItemError,
  });
  const Category = IDL.Variant({
    'Baby' : IDL.Null,
    'ClothingShoesAccessories' : IDL.Null,
    'HomeKitchen' : IDL.Null,
    'Books' : IDL.Null,
    'PetsAccessories' : IDL.Null,
    'BeautyPersonalCare' : IDL.Null,
    'Electronics' : IDL.Null,
    'SportsOutdoor' : IDL.Null,
    'FoodBeverages' : IDL.Null,
    'HomeImprovement' : IDL.Null,
  });
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
    'billing_address' : IDL.Text,
    'item' : IDL.Text,
    'description' : IDL.Text,
    'stock' : IDL.Nat64,
    'category' : Category,
    'rating' : IDL.Opt(Rating),
    'image' : IDL.Text,
    'contract_address' : IDL.Text,
    'price' : IDL.Nat64,
  });
  const ResultItems = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, Item)),
    'Err' : ItemError,
  });
  const Result_get_address = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, Address)),
    'Err' : ItemError,
  });
  const CreateItem = IDL.Record({
    'billing_address' : IDL.Text,
    'item' : IDL.Text,
    'description' : IDL.Text,
    'stock' : IDL.Nat64,
    'category' : IDL.Text,
    'image' : IDL.Text,
    'contract_address' : IDL.Text,
    'price' : IDL.Nat64,
  });
  const AddressEdit = IDL.Record({
    'country' : IDL.Opt(IDL.Text),
    'city' : IDL.Opt(IDL.Text),
    'postal_code' : IDL.Opt(IDL.Text),
    'state' : IDL.Opt(IDL.Text),
    'address' : IDL.Opt(IDL.Text),
    'phone_number' : IDL.Opt(IDL.Text),
  });
  const UserAddressEdit = IDL.Record({ 'address' : AddressEdit });
  const UpdateItem = IDL.Record({
    'description' : IDL.Opt(IDL.Text),
    'stock' : IDL.Opt(IDL.Nat64),
    'image' : IDL.Opt(IDL.Text),
    'price' : IDL.Opt(IDL.Nat64),
  });
  return IDL.Service({
    'associate_address' : IDL.Func([CreateUserAddress], [], []),
    'create_purchase' : IDL.Func([CreatePurchase], [Result], []),
    'get_address_by_id' : IDL.Func(
        [IDL.Nat64],
        [Result_get_address_by_id],
        ['query'],
      ),
    'get_contract_address' : IDL.Func([IDL.Nat64], [Result_get], ['query']),
    'get_item_billing_address' : IDL.Func([IDL.Nat64], [Result_get], ['query']),
    'get_item_owner' : IDL.Func([IDL.Nat64], [Result_get_owner], []),
    'get_items' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat64, Item))],
        ['query'],
      ),
    'get_items_owner' : IDL.Func([], [ResultItems], ['query']),
    'get_user_addresses' : IDL.Func([], [Result_get_address], ['query']),
    'remove_item' : IDL.Func([IDL.Nat64], [Result], []),
    'set_item' : IDL.Func([CreateItem], [Result], []),
    'update_address' : IDL.Func([IDL.Nat64, UserAddressEdit], [Result], []),
    'update_item' : IDL.Func([IDL.Nat64, UpdateItem], [Result], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => { return [IDL.Opt(IDL.Text)]; };
