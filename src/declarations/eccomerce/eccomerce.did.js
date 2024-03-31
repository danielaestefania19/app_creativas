export const idlFactory = ({ IDL }) => {
  const AddItem = IDL.Record({ 'item' : IDL.Nat64, 'amount' : IDL.Nat64 });
  const ItemError = IDL.Variant({
    'AlreadyVoted' : IDL.Null,
    'InvalidRating' : IDL.Null,
    'ItemNotAllowed' : IDL.Null,
    'UpdateError' : IDL.Null,
    'AlreadyExist' : IDL.Null,
    'ItemNotFound' : IDL.Null,
    'OutOfStock' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'InvalidOwner' : IDL.Null,
    'NoVotes' : IDL.Null,
    'NotExist' : IDL.Null,
    'NoItemsAssociated' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ItemError });
  const AddProfilePicture = IDL.Record({ 'profile_picture' : IDL.Text });
  const CreateReview = IDL.Record({
    'review' : IDL.Text,
    'rating' : IDL.Nat64,
    'item_id' : IDL.Nat64,
  });
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
  const Result_get_address_by_id = IDL.Variant({
    'Ok' : IDL.Opt(Address),
    'Err' : ItemError,
  });
  const Result_get = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : ItemError });
  const Rating = IDL.Variant({
    'One' : IDL.Null,
    'Two' : IDL.Null,
    'Five' : IDL.Null,
    'Four' : IDL.Null,
    'Zero' : IDL.Null,
    'Three' : IDL.Null,
  });
  const Review = IDL.Record({
    'review' : IDL.Text,
    'rating' : Rating,
    'reviewer' : IDL.Opt(IDL.Principal),
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
  const Item = IDL.Record({
    'reviews' : IDL.Vec(Review),
    'owner' : IDL.Opt(IDL.Principal),
    'billing_address' : IDL.Text,
    'item' : IDL.Text,
    'description' : IDL.Text,
    'stock' : IDL.Nat64,
    'category' : Category,
    'image' : IDL.Text,
    'contract_address' : IDL.Text,
    'price' : IDL.Nat64,
  });
  const Result_item = IDL.Variant({ 'Ok' : Item, 'Err' : ItemError });
  const Result_get_owner = IDL.Variant({
    'Ok' : IDL.Principal,
    'Err' : ItemError,
  });
  const Result_get_category = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, Item)),
    'Err' : ItemError,
  });
  const ResultItems = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, Item)),
    'Err' : ItemError,
  });
  const Result_get_len_card = IDL.Variant({
    'Ok' : IDL.Nat64,
    'Err' : ItemError,
  });
  const Result_get_address = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, Address)),
    'Err' : ItemError,
  });
  const Card = IDL.Record({
    'item' : Item,
    'amount' : IDL.Nat64,
    'item_id' : IDL.Nat64,
  });
  const ShippingCard = IDL.Record({
    'card' : IDL.Vec(Card),
    'total_price' : IDL.Nat64,
  });
  const Result_get_user_card = IDL.Variant({
    'Ok' : ShippingCard,
    'Err' : ItemError,
  });
  const PurchaseStatus = IDL.Variant({
    'Started' : IDL.Null,
    'Disputed' : IDL.Null,
    'Refunded' : IDL.Null,
    'Paid' : IDL.Null,
    'Delivered' : IDL.Null,
    'Shipped' : IDL.Null,
    'Completed' : IDL.Null,
  });
  const Purchase = IDL.Record({
    'status' : PurchaseStatus,
    'name' : IDL.Text,
    'shipping_address' : Address,
    'account_seller' : IDL.Text,
    'seller' : IDL.Opt(IDL.Principal),
    'account_buyer' : IDL.Text,
    'buyer' : IDL.Opt(IDL.Principal),
    'contract_address' : IDL.Text,
    'payment_id' : IDL.Nat64,
    'amount' : IDL.Nat64,
    'item_id' : IDL.Nat64,
    'lastname' : IDL.Text,
  });
  const Result_get_purchases = IDL.Variant({
    'Ok' : IDL.Vec(Purchase),
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
    'add_item_card' : IDL.Func([AddItem], [Result], []),
    'add_picture' : IDL.Func([IDL.Nat64, AddProfilePicture], [Result], []),
    'add_review' : IDL.Func([CreateReview], [Result], []),
    'associate_address' : IDL.Func([CreateUserAddress], [], []),
    'clear_cart' : IDL.Func([], [Result], []),
    'create_purchase' : IDL.Func([CreatePurchase], [Result], []),
    'get_address_by_id' : IDL.Func(
        [IDL.Nat64],
        [Result_get_address_by_id],
        ['query'],
      ),
    'get_contract_address' : IDL.Func([IDL.Nat64], [Result_get], ['query']),
    'get_item' : IDL.Func([IDL.Nat64], [Result_item], ['query']),
    'get_item_billing_address' : IDL.Func([IDL.Nat64], [Result_get], ['query']),
    'get_item_owner' : IDL.Func([IDL.Nat64], [Result_get_owner], []),
    'get_items' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat64, Item))],
        ['query'],
      ),
    'get_items_by_category' : IDL.Func(
        [IDL.Text],
        [Result_get_category],
        ['query'],
      ),
    'get_items_owner' : IDL.Func([], [ResultItems], ['query']),
    'get_total_items_in_cart' : IDL.Func([], [Result_get_len_card], ['query']),
    'get_total_price' : IDL.Func([], [Result_get_len_card], ['query']),
    'get_user_addresses' : IDL.Func([], [Result_get_address], ['query']),
    'get_user_cart' : IDL.Func([], [Result_get_user_card], ['query']),
    'get_your_purchases' : IDL.Func([], [Result_get_purchases], ['query']),
    'get_your_sales' : IDL.Func([], [Result_get_purchases], ['query']),
    'item_in_cart' : IDL.Func(
        [IDL.Principal, IDL.Nat64],
        [IDL.Bool],
        ['query'],
      ),
    'manager' : IDL.Func([], [IDL.Principal], ['query']),
    'remove_item' : IDL.Func([IDL.Nat64], [Result], []),
    'remove_item_from_cart' : IDL.Func([IDL.Nat64], [Result], []),
    'set_item' : IDL.Func([CreateItem], [Result], []),
    'update_address' : IDL.Func([IDL.Nat64, UserAddressEdit], [Result], []),
    'update_item' : IDL.Func([IDL.Nat64, UpdateItem], [Result], []),
    'update_item_card' : IDL.Func([AddItem, IDL.Text], [Result], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
