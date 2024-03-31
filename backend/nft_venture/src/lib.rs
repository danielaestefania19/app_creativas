use b3_utils::call;
use candid::types::principal;
// use b3_utils::{call, caller_is_controller};
use candid::Principal;
use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::collections::hash_map::DefaultHasher;
use std::collections::HashSet;
use std::hash::{Hash, Hasher};
use strsim::levenshtein;
use unicode_normalization::UnicodeNormalization;

use serde_derive::Serialize;
use std::collections::HashMap;
use std::{borrow::Cow, cell::RefCell};


type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_VALUE_SIZE_CROWDFUNDING: u32 = 8000;
const MAX_VALUE_SIZE_PRINCIPAL: u32 = 200;
const MAX_VALUE_SIZE_VEC_STORABLE: u32 = 8000;
const MAX_VALUE_SIZE_PROJECT_TYPE: u32 = 5000;
const MAX_VALUE_SIZE_PRINCIPAL_INVEST: u32 = 5000;
const MAX_VALUE_SIZE_CATEGORY: u32 = 5000;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash, PartialEq, Ord, PartialOrd, Eq)]
enum Category {
    Art,
    Comics,
    Crafts,
    Dance,
    Design,
    Fashion,
    Film,
    Food,
    Games,
    Music,
    Photography,
    Technology,
    Theater,
    // Agrega más categorías según sea necesario
}

impl Category {
    fn from_str(category: &str) -> Option<Self> {
        match category {
            "Art" => Some(Category::Art),
            "Comics" => Some(Category::Comics),
            "Crafts" => Some(Category::Crafts),
            "Dance" => Some(Category::Dance),
            "Design" => Some(Category::Design),
            "Fashion" => Some(Category::Fashion),
            "Film" => Some(Category::Film),
            "Food" => Some(Category::Food),
            "Games" => Some(Category::Games),
            "Music" => Some(Category::Music),
            "Photography" => Some(Category::Photography),
            "Technology" => Some(Category::Technology),
            "Theater" => Some(Category::Theater),
            _ => None,
        }
    }
}

impl Storable for Category {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_CATEGORY,
        is_fixed_size: false,
    };
}
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash, PartialEq)]
enum AssetError {
    AlreadyExist,
    NotAllowed,
    NotExist,
    Unauthorized,
    UpdateError,
    NoAssetsAssociated,
    InvalidOwner,
    NoVotes,
    AlreadyVoted,
    InvalidRating,
    OutOfStock,
}

#[derive(CandidType, Deserialize, Clone, PartialEq, Eq, PartialOrd, Ord, Copy)]
enum ProjectType {
    Reward, 
    Donation, 
    Loan, 
    Equity
}

impl ProjectType {
    fn from_str(project_type: &str) -> Option<Self> {
        match project_type {
            "Reward" => Some(ProjectType::Reward),
            "Donation" => Some(ProjectType::Donation),
            "Loan" => Some(ProjectType::Loan),
            "Equity" => Some(ProjectType::Equity),
            _ => None,
        }
    }
}

impl Storable for ProjectType {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_PROJECT_TYPE,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone, PartialEq)]
pub struct AssetInvest {
    investments: Vec<(Principal, String, u64, u64)>, // Almacena los Principals que han invertido, las cuentas utilizadas para la inversión, la cantidad invertida y la cantidad de tokens comprados
}


impl Storable for AssetInvest {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_PRINCIPAL_INVEST,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone)]
pub struct PrincipalInvest {
    investments: HashMap<u64, (HashSet<String>, u64, u64)>, // Añade dos u64 para rastrear la cantidad total de tokens y el monto total invertido
}


impl Storable for PrincipalInvest {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_PRINCIPAL_INVEST,
        is_fixed_size: false,
    };

    
}
#[derive(CandidType, Deserialize, Clone, PartialEq, Eq, PartialOrd, Ord, Copy)]
enum AssetState {
    Active,
    Successful,
    Failed,
}
#[derive(CandidType, Deserialize, Clone)]
pub struct Asset {
    asset_id: u64,
    price: u64,
    autor: Vec<Principal>,
    titulo: String,
    small_description: String,
    project_start_date: u64,
    project_end_date: u64,
    nftfractional: u64,
    business_plan_hash: String,
    token_hash: String,
    proyect_type: ProjectType,
    end_crowfunding: u64,
    reward: Option<String>,
    profit_per_token_percentage: Option<u64>,
    equityamountbytoken: Option<u64>,
    category: Category, // Añade un campo de categoría
    state: AssetState,



}

#[derive(CandidType, Deserialize, Clone)]
pub struct CreateAsset {
    price: u64,
    autor: Vec<Principal>, // Cambiado de 'String' a 'Vec<String>'
    titulo: String,
    small_description: String,
    project_start_date: u64,
    project_end_date: u64,
    nftfractional: u64,
    business_plan_hash: String,
    token_hash: String,
    proyect_type: ProjectType,
    end_crowfunding: u64,
    reward: Option<String>,
    profit_per_token_percentage: Option<u64>,
    equityamountbytoken: Option<u64>,
    category: Category, // Añade un campo de categoría

}


impl Storable for Asset {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_CROWDFUNDING,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone, PartialEq, PartialOrd, Eq, Ord, Copy, Hash)]
pub struct KeyPrincipal {
    key: Principal,
}

impl Storable for KeyPrincipal {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_PRINCIPAL,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone, Default)]
pub struct OwnertoAsset {
    withaccounts: Vec<String>, // Almacena las cuentas
    assets_ids: Vec<u64> // Almacena los IDs de los activos
}


impl Storable for OwnertoAsset {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_PRINCIPAL,
        is_fixed_size: false,
    };
}


#[derive(CandidType, Deserialize, Clone, Default)]
pub struct VecStorable {
    ids: Vec<u64>,
}
impl Storable for VecStorable {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_VEC_STORABLE,
        is_fixed_size: false,
    };
}



// fn strings_to_principals(strings: Vec<String>) -> Result<Vec<Principal>, AssetError> {
//     let mut principals = Vec::new();
//     for s in strings {
//         match Principal::from_text(&s) {
//             Ok(p) => principals.push(p),
//             Err(_) => return Err(AssetError::NotAllowed),
//         }
//     }
//     Ok(principals)
// }


thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    static ASSETS: RefCell<StableBTreeMap<u64, Asset, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),

    ));

    static PROYECT_TYPES: RefCell<StableBTreeMap<ProjectType, VecStorable, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
    ));


    static ASSETS_OWNER: RefCell<StableBTreeMap<KeyPrincipal, OwnertoAsset, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
    ));


    static PRINCIPAL_INVEST: RefCell<StableBTreeMap<KeyPrincipal, PrincipalInvest, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),

    ));
    static ASSET_INVEST: RefCell<StableBTreeMap<u64, AssetInvest, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(4))),
    ));

    static CATEGORY_ASSETS: RefCell<StableBTreeMap<Category, VecStorable, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(5))),
    ));

static LAST_SUCCESSFUL_LENGTH: RefCell<usize> = RefCell::new(0);
static LAST_FAILED_LENGTH: RefCell<usize> = RefCell::new(0);

static PROCESSED_SUCCESSFUL_IDS: RefCell<HashSet<u64>> = RefCell::new(HashSet::new());
static PROCESSED_FAILED_IDS: RefCell<HashSet<u64>> = RefCell::new(HashSet::new());


}




#[ic_cdk::update]
fn set_asset(asset_id: u64, create_asset: CreateAsset, to: String) -> Result<(), AssetError> {
    let principal = ic_cdk::api::caller();

    // Verifica que el precio sea al menos 1
    if create_asset.price < 1 {
        return Err(AssetError::NotAllowed);
    }

   
    let mut reward = create_asset.reward;
    let mut profit_per_token_percentage = create_asset.profit_per_token_percentage;
    let mut equityamountbytoken = create_asset.equityamountbytoken;

    match create_asset.proyect_type {
        ProjectType::Reward => {
            if reward.is_none() || reward.clone().unwrap().is_empty() {
                return Err(AssetError::NotAllowed);
            }
            profit_per_token_percentage = None;
            equityamountbytoken = None;
        }
        ProjectType::Donation => {
            reward = None;
            profit_per_token_percentage = None;
            equityamountbytoken = None;
        }
        ProjectType::Loan => {
            if profit_per_token_percentage.is_none() || profit_per_token_percentage.unwrap() == 0 {
                return Err(AssetError::NotAllowed);
            }
            reward = None;
            equityamountbytoken = None;
        }
        ProjectType::Equity => {
            if equityamountbytoken.is_none() || equityamountbytoken.unwrap() == 0 {
                return Err(AssetError::NotAllowed);
            }
            reward = None;
            profit_per_token_percentage = None;
        }
    }

    let asset = Asset {
        asset_id,
        price: create_asset.price,
        autor: create_asset.autor,
        titulo: create_asset.titulo,
        small_description: create_asset.small_description,
        project_start_date: create_asset.project_start_date,
        project_end_date: create_asset.project_end_date,
        nftfractional: create_asset.nftfractional,
        business_plan_hash: create_asset.business_plan_hash,
        token_hash: create_asset.token_hash,
        proyect_type: create_asset.proyect_type,
        end_crowfunding: create_asset.end_crowfunding,
        reward,
        profit_per_token_percentage,
        equityamountbytoken,
        category: create_asset.category, // Guarda la categoría del proyecto
        state: AssetState::Active, // Inicia el proyecto en el estado Active
    };

    ASSETS.with(|p| p.borrow_mut().insert(asset_id, asset.clone()));

    PROYECT_TYPES.with(|items| {
        let mut items = items.borrow_mut();
        if !items.contains_key(&asset.proyect_type) {
            items.insert(asset.proyect_type.clone(), VecStorable { ids: Vec::new() });
        }
        let project_items = items.get(&asset.proyect_type).unwrap().clone();
        let mut updated_project_items = project_items;
        updated_project_items.ids.push(asset_id);
        items.insert(asset.proyect_type.clone(), updated_project_items);
    });

    CATEGORY_ASSETS.with(|items| {
        let mut items = items.borrow_mut();
        if !items.contains_key(&asset.category) {
            items.insert(asset.category.clone(), VecStorable { ids: Vec::new() });
        }
        let category_items = items.get(&asset.category).unwrap().clone();
        let mut updated_category_items = category_items;
        updated_category_items.ids.push(asset_id);
        items.insert(asset.category.clone(), updated_category_items);
    });

    ASSETS_OWNER.with(|items| {
        let mut items = items.borrow_mut();
        let key_principal = KeyPrincipal {
            key: principal.clone(),
        };
        if !items.contains_key(&key_principal) {
            items.insert(key_principal.clone(), OwnertoAsset { withaccounts: Vec::new(), assets_ids: Vec::new() });
        }
        let owner_assets = items.get(&key_principal).unwrap().clone();
        let mut updated_owner_assets = owner_assets;
        updated_owner_assets.assets_ids.push(asset_id);
        updated_owner_assets.withaccounts.push(to.clone());
        items.insert(key_principal.clone(), updated_owner_assets);
    });
    
    Ok(())
}



#[ic_cdk::query]
fn get_assets() -> Vec<(u64, Asset)> {
    ASSETS.with(|p| {
        p.borrow()
            .iter()
            .map(|(k, v)| (k, v.clone()))
            .collect()
    })
}

#[ic_cdk::query]
fn get_asset_by_id(asset_id: u64) -> Result<(Asset, Principal, String), AssetError> {
    let asset = match ASSETS.with(|p| p.borrow().get(&asset_id)) {
        Some(asset) => asset.clone(),
        None => return Err(AssetError::NoAssetsAssociated),
    };

    let (principal, account) = match ASSETS_OWNER.with(|items| {
        let items = items.borrow();
        for (key_principal, owner_to_asset) in items.iter() {
            if owner_to_asset.assets_ids.contains(&asset_id) {
                let index = owner_to_asset.assets_ids.iter().position(|&id| id == asset_id).unwrap();
                let account = owner_to_asset.withaccounts[index].clone();
                return Some((key_principal.key.clone(), account));
            }
        }
        None
    }) {
        Some(info) => info,
        None => return Err(AssetError::NoAssetsAssociated),
    };

    Ok((asset, principal, account))
}

#[ic_cdk::query]
fn get_assets_by_category_and_type(category_str: String, project_type_str: String) -> Result<Vec<(u64, Asset)>, AssetError> {
    // Convierte las cadenas en los tipos de enumeración correspondientes
    let category = Category::from_str(&category_str).ok_or(AssetError::NotExist)?;
    let project_type = ProjectType::from_str(&project_type_str).ok_or(AssetError::NotExist)?;

    // Obtén los IDs de los proyectos que coinciden con la categoría
    let category_ids = CATEGORY_ASSETS.with(|items| {
        items
            .borrow()
            .get(&category)
            .unwrap_or_default()
            .ids
            .clone()
    });

    // Obtén los IDs de los proyectos que coinciden con el tipo de proyecto
    let type_ids = PROYECT_TYPES.with(|items| {
        items
            .borrow()
            .get(&project_type)
            .unwrap_or_default()
            .ids
            .clone()
    });

    // Encuentra los IDs que están en ambas listas
    let matching_ids: Vec<u64> = category_ids.into_iter().filter(|id| type_ids.contains(id)).collect();

    if matching_ids.is_empty() {
        return Err(AssetError::NoAssetsAssociated);
    }

    // Obtén los proyectos que coinciden con los IDs
    let matching_assets = ASSETS.with(|assets_map| {
        let assets_map = assets_map.borrow();
        matching_ids
            .into_iter()
            .filter_map(|id| assets_map.get(&id).map(|asset| (id, asset.clone())))
            .collect()
    });

    Ok(matching_assets)
}





#[ic_cdk::query]
fn get_assets_owner() -> Result<Vec<(u64, Asset, String)>, AssetError> {
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal {
        key: caller_principal.clone(),
    };

    let owner_assets = ASSETS_OWNER.with(|items| {
        items
            .borrow()
            .get(&key_principal)
            .unwrap_or_default()
            .clone()
    });

    if owner_assets.assets_ids.is_empty() {
        return Err(AssetError::NoAssetsAssociated);
    }

    let assets_owned = ASSETS.with(|assets_map| {
        let assets_map = assets_map.borrow();
        owner_assets.assets_ids
            .iter()
            .enumerate()
            .filter_map(|(index, id)| assets_map.get(id).map(|asset| (*id, asset.clone(), owner_assets.withaccounts[index].clone())))
            .collect()
    });

    Ok(assets_owned)
}

#[ic_cdk::query]
fn is_creator_investing(asset_id: u64) -> bool {
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal {
        key: caller_principal.clone(),
    };

    match ASSETS_OWNER.with(|items| items.borrow().get(&key_principal)) {
        Some(owner_assets) => owner_assets.assets_ids.contains(&asset_id),
        None => false,
    }
}


#[ic_cdk::update]
fn save_invest_user(asset_id: u64, account: String, amount: u64, tokens: u64) {
    let caller_principal = ic_cdk::api::caller();
    PRINCIPAL_INVEST.with(|items| {
        let mut items = items.borrow_mut();
        let key_principal = KeyPrincipal {
            key: caller_principal.clone(),
        };
        if !items.contains_key(&key_principal) {
            items.insert(key_principal.clone(), PrincipalInvest { investments: HashMap::new() });
        }
        let principal_invest = items.get(&key_principal).unwrap().clone();
        let mut updated_principal_invest = principal_invest;
        // Añadir la cuenta a la lista de inversiones para este Asset
        let (accounts, total_tokens, total_amount) = updated_principal_invest.investments.entry(asset_id).or_insert_with(|| (HashSet::new(), 0, 0));
        accounts.insert(account);
        *total_tokens += tokens;
        *total_amount += amount;
        items.insert(key_principal.clone(), updated_principal_invest);
    });
}


#[ic_cdk::query]
fn get_investments_by_principal() -> Result<Vec<(u64, Asset, Vec<String>, u64, u64)>, AssetError> {
    let caller_principal = ic_cdk::api::caller();
    
    let key_principal = KeyPrincipal {
        key: caller_principal.clone(),
    };
    match PRINCIPAL_INVEST.with(|p| p.borrow().get(&key_principal)) {
        Some(investments) => {
            let investments_as_vecs = investments.investments.iter()
                .filter_map(|(asset_id, (accounts, total_tokens, total_amount))| {
                    ASSETS.with(|assets_map| {
                        let assets_map = assets_map.borrow();
                        assets_map.get(asset_id).map(|asset| (*asset_id, asset.clone(), accounts.iter().cloned().collect(), *total_tokens, *total_amount))
                    })
                })
                .collect();
            Ok(investments_as_vecs)
        },
        None => Err(AssetError::NoAssetsAssociated),
    }
}



#[ic_cdk::update]
fn save_invest_asset(asset_id: u64, account: String, amount: u64, tokens: u64) {
    let caller_principal = ic_cdk::api::caller();
    ASSET_INVEST.with(|items| {
        let mut items = items.borrow_mut();
        if !items.contains_key(&asset_id) {
            items.insert(asset_id, AssetInvest { investments: Vec::new() });
        }
        let asset_invest = items.get(&asset_id).unwrap().clone();
        let mut updated_asset_invest = asset_invest;
        updated_asset_invest.investments.push((caller_principal, account, amount, tokens));
        items.insert(asset_id, updated_asset_invest);
    });
}

#[ic_cdk::query]
fn get_investments_by_asset(asset_id: u64) -> Result<Vec<(String, String, u64, u64)>, AssetError> {
    match ASSET_INVEST.with(|p| p.borrow().get(&asset_id)) {
        Some(investments) => {
            let investments_as_strings = investments.investments.iter()
                .map(|(principal, account, amount, tokens)| (principal.to_text(), account.clone(), *amount, *tokens))
                .collect();
            Ok(investments_as_strings)
        },
        None => Err(AssetError::NoAssetsAssociated),
    }
}


#[ic_cdk::query]
fn get_total_tokens_by_principal_for_asset(principal: Principal, asset_id: u64) -> Result<u64, AssetError> {
    let key_principal = KeyPrincipal {
        key: principal.clone(),
    };
    match ASSET_INVEST.with(|p| p.borrow().get(&asset_id)) {
        Some(asset_invest) => {
            let total_tokens = asset_invest.investments.iter()
                .filter(|(p, _, _, _)| p == &key_principal.key) // Aquí es donde se realiza el cambio
                .map(|(_, _, _, tokens)| *tokens)
                .sum();
            Ok(total_tokens)
        },
        None => Err(AssetError::NoAssetsAssociated),
    }
}

#[ic_cdk::update]
fn update_asset_states(successful_ids: Vec<u64>, failed_ids: Vec<u64>) {
    ASSETS.with(|assets_map| {
        let mut assets_map = assets_map.borrow_mut();

        let successful_ids_clone = successful_ids.clone(); // Clona successful_ids

        if successful_ids_clone.len() != LAST_SUCCESSFUL_LENGTH.with(|l| *l.borrow()) {
            for id in successful_ids {
                if !PROCESSED_SUCCESSFUL_IDS.with(|p| p.borrow().contains(&id)) {
                    if let Some(asset) = assets_map.get(&id).clone() {
                        let mut updated_asset = asset;
                        updated_asset.state = AssetState::Successful;
                        assets_map.insert(id, updated_asset);
                    }
                    PROCESSED_SUCCESSFUL_IDS.with(|p| p.borrow_mut().insert(id));
                }
            }
            // Actualiza la longitud de successful_ids
            LAST_SUCCESSFUL_LENGTH.with(|l| *l.borrow_mut() = successful_ids_clone.len()); // Usa successful_ids_clone aquí
        }

        let failed_ids_clone = failed_ids.clone(); // Clona failed_ids

        if failed_ids_clone.len() != LAST_FAILED_LENGTH.with(|l| *l.borrow()) {
            for id in failed_ids {
                if !PROCESSED_FAILED_IDS.with(|p| p.borrow().contains(&id)) {
                    if let Some(asset) = assets_map.get(&id).clone() {
                        let mut updated_asset = asset;
                        updated_asset.state = AssetState::Failed;
                        assets_map.insert(id, updated_asset);
                    }
                    PROCESSED_FAILED_IDS.with(|p| p.borrow_mut().insert(id));
                }
            }
            // Actualiza la longitud de failed_ids
            LAST_FAILED_LENGTH.with(|l| *l.borrow_mut() = failed_ids_clone.len()); // Usa failed_ids_clone aquí
        }
    });
}



#[ic_cdk::query]
fn whoami() -> Principal {
    ic_cdk::api::caller()
}
