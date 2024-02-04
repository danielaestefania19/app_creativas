use candid::Principal;
use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};
use serde_derive::Serialize;
use std::{borrow::Cow, cell::RefCell};

// Definición de tipos y constantes
type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_VALUE_SIZE_ITEM: u32 = 5000;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash, PartialEq)]
enum RatingError {
    Alreadyrated,
    InvalidValue,
    UpdateError,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash, PartialEq)]
enum ItemError {
    AlreadyExist,
    ItemNotAllowed,
    NotExist,
    Unauthorized,
    UpdateError,
    NoItemsAssociated,
    InvalidOwner,
    NoVotes,
    ItemNotFound,
    AlreadyVoted,

}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash, PartialEq)]
enum ItemSuccess {
    CreatedItem,
    UpdateItem,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash, PartialEq)]
pub enum Rating {
    Zero,
    One,
    Two,
    Three,
    Four,
    Five,
}

impl Rating {
    pub fn value(&self) -> u8 {
        match self {
            Rating::Zero => 0,
            Rating::One => 1,
            Rating::Two => 2,
            Rating::Three => 3,
            Rating::Four => 4,
            Rating::Five => 5,
        }
        
    }
    pub fn from_value(value: u64) -> Option<Rating> {
        match value {
            0 => Some(Rating::Zero),
            1 => Some(Rating::One),
            2 => Some(Rating::Two),
            3 => Some(Rating::Three),
            4 => Some(Rating::Four),
            5 => Some(Rating::Five),
            _ => None, // Devuelve None si el valor no es válido
        }
    }
    
}


#[derive(CandidType, Deserialize, Clone)]
struct Item {
    item: String,
    price: u64,
    description: String,
    image: String,
    rating: Option<Rating>,
    owner: Option<Principal>,
    contract_address: String,

   
}



#[derive(CandidType, Deserialize)]
pub struct CreateItem {
    item: String,
    price: u64,
    description: String,
    image: String,
    owner: String, 
    contract_address: String,
}



// Implementación de trait para la serialización y deserialización de Item

impl Storable for Item {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_ITEM,
        is_fixed_size: false,
    };
}
pub struct IDManager {
    next_id: std::cell::Cell<u64>,
}

impl IDManager {
    pub fn new() -> IDManager {
        IDManager {
            next_id: std::cell::Cell::new(1),
        }
    }

    pub fn get_id(&self) -> u64 {
        let mut id = self.next_id.get();
        while check_if_item_exists(id) {
            id += 1;
        }
        self.next_id.set(id + 1);
        id
    }
}

// Inicialización de la memoria, los ítems y el administrador de ID

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    static ITEMS: RefCell<StableBTreeMap<u64, Item, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
    ));
    static ID_MANAGER: IDManager = IDManager::new();
}

// Función para convertir un String a un Principal
fn string_a_principal(s: String) -> Result<Principal, ItemError> {
    Principal::from_text(&s).map_err(|_| ItemError::InvalidOwner)
}

#[ic_cdk::update]
fn set_item(item: CreateItem) -> Result<ItemSuccess, ItemError> {
    let id = ID_MANAGER.with(|manager| manager.get_id());
    print!("{}", id);

    let owner_principal = string_a_principal(item.owner)?;

    let value: Item = Item {
        item: item.item,
        price: item.price,
        description: item.description,
        image: item.image,
        rating: None,
        owner: Some(owner_principal), 
        contract_address: item.contract_address
    };

    ITEMS.with(|p| p.borrow_mut().insert(id, value.clone()));
    Ok(ItemSuccess::CreatedItem)
}


#[ic_cdk::query]
fn check_if_item_exists(id: u64) -> bool {
    ITEMS.with(|p| p.borrow().contains_key(&id))
}

#[ic_cdk::query]
fn get_items() -> Vec<(u64, Item)> {
    ITEMS.with(|p| {
        p.borrow()
            .iter()
            .map(|(k, v)| (k.clone(), v.clone()))
            .collect()
    })
}

#[ic_cdk::update]
fn update_item(id: u64, item: CreateItem) -> Result<(), ItemError> {
    let caller_principal = string_a_principal(item.owner)?; // Usa la función string_a_principal para convertir el String owner a un Principal
    ITEMS.with(|p| {
        let old_item_opt = p.borrow().get(&id);
        let old_item: Item;

        match old_item_opt {
            Some(value) => old_item = value,
            None => return Err(ItemError::NotExist),
        }

        if let Some(owner) = old_item.owner {
            if caller_principal != owner {
                return Err(ItemError::Unauthorized);
            }
        }
        let value: Item = Item {
            item: item.item,
            price: item.price,
            description: item.description,
            image: item.image,
            rating: old_item.rating,
            owner: Some(caller_principal),
            contract_address:  old_item.contract_address,
            //ratings: old_item.ratings,
        };

        let result = p.borrow_mut().insert(id, value);

        match result {
            Some(_) => Ok(()),
            None => Err(ItemError::UpdateError),
        }
    })
}

#[ic_cdk::update]
fn remove_item(id: u64, owner: String) -> Result<(), ItemError> {
    let caller_principal = string_a_principal(owner)?; // Usa la función string_a_principal para convertir el String owner a un Principal
    ITEMS.with(|p| {
        let old_item_opt = p.borrow().get(&id);
        let old_item: Item;

        match old_item_opt {
            Some(value) => old_item = value,
            None => return Err(ItemError::NotExist),
        }

        if let Some(owner) = old_item.owner {
            if caller_principal != owner {
                return Err(ItemError::Unauthorized);
            }
        }
        p.borrow_mut().remove(&id);
        Ok(())
    })
}

#[ic_cdk::query]
fn get_items_owner(owner: String) -> Result<Vec<(u64, Item)>, ItemError> {
    let caller_principal = string_a_principal(owner)?; // Usa la función string_a_principal para convertir el String owner a un Principal
    let mut items_owned = Vec::new();

    ITEMS.with(|p| {
        for (id, item) in p.borrow().iter() {
            if item.owner == Some(caller_principal) {
                items_owned.push((id.clone(), item.clone()));
            }
        }
    });

    if items_owned.is_empty() {
        Err(ItemError::NoItemsAssociated)
    } else {
        Ok(items_owned)
    }
}

#[ic_cdk::query]
fn whoami() -> Principal {
    ic_cdk::api::caller()
}
