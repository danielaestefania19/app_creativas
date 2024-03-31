export const idlFactory = ({ IDL }) => {
  const ProjectType = IDL.Variant({
    'Loan' : IDL.Null,
    'Reward' : IDL.Null,
    'Donation' : IDL.Null,
    'Equity' : IDL.Null,
  });
  const Asset = IDL.Record({
    'reward' : IDL.Opt(IDL.Text),
    'titulo' : IDL.Text,
    'autor' : IDL.Vec(IDL.Principal),
    'proyect_type' : ProjectType,
    'equityamountbytoken' : IDL.Opt(IDL.Nat64),
    'project_start_date' : IDL.Nat64,
    'project_end_date' : IDL.Nat64,
    'small_description' : IDL.Text,
    'end_crowfunding' : IDL.Nat64,
    'business_plan_hash' : IDL.Text,
    'price' : IDL.Nat64,
    'asset_id' : IDL.Nat64,
    'profit_per_token_percentage' : IDL.Opt(IDL.Nat64),
    'token_hash' : IDL.Text,
    'nftfractional' : IDL.Nat64,
  });
  const AssetError = IDL.Variant({
    'AlreadyVoted' : IDL.Null,
    'InvalidRating' : IDL.Null,
    'NoAssetsAssociated' : IDL.Null,
    'NotAllowed' : IDL.Null,
    'UpdateError' : IDL.Null,
    'AlreadyExist' : IDL.Null,
    'OutOfStock' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'InvalidOwner' : IDL.Null,
    'NoVotes' : IDL.Null,
    'NotExist' : IDL.Null,
  });
  const Result_asset = IDL.Variant({ 'Ok' : Asset, 'Err' : AssetError });
  const Result_asset_category = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, Asset)),
    'Err' : AssetError,
  });
  const Result_asset_owner = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, Asset, IDL.Text)),
    'Err' : AssetError,
  });
  const Result_investments_asset = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'Err' : AssetError,
  });
  const Result_invest_principal = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Text)),
    'Err' : AssetError,
  });
  const CreateAsset = IDL.Record({
    'reward' : IDL.Opt(IDL.Text),
    'titulo' : IDL.Text,
    'autor' : IDL.Vec(IDL.Principal),
    'proyect_type' : ProjectType,
    'equityamountbytoken' : IDL.Opt(IDL.Nat64),
    'project_start_date' : IDL.Nat64,
    'project_end_date' : IDL.Nat64,
    'small_description' : IDL.Text,
    'end_crowfunding' : IDL.Nat64,
    'business_plan_hash' : IDL.Text,
    'price' : IDL.Nat64,
    'profit_per_token_percentage' : IDL.Opt(IDL.Nat64),
    'token_hash' : IDL.Text,
    'nftfractional' : IDL.Nat64,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : AssetError });
  return IDL.Service({
    'get_asset_by_id' : IDL.Func([IDL.Nat64], [Result_asset], ['query']),
    'get_assets' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat64, Asset))],
        ['query'],
      ),
    'get_assets_by_type' : IDL.Func(
        [ProjectType],
        [Result_asset_category],
        ['query'],
      ),
    'get_assets_owner' : IDL.Func([], [Result_asset_owner], ['query']),
    'get_investments_by_asset' : IDL.Func(
        [IDL.Nat64],
        [Result_investments_asset],
        ['query'],
      ),
    'get_investments_by_principal' : IDL.Func(
        [],
        [Result_invest_principal],
        ['query'],
      ),
    'save_invest_asset' : IDL.Func([IDL.Nat64, IDL.Text], [], []),
    'save_invest_user' : IDL.Func([IDL.Nat64, IDL.Text], [], []),
    'set_asset' : IDL.Func([IDL.Nat64, CreateAsset, IDL.Text], [Result], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
