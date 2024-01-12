use candid::Principal;
use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, StableBTreeMap, Storable};
use serde_derive::Serialize;
use std::{borrow::Cow, cell::RefCell};

// Definición de tipos y constantes

type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_VALUE_SIZE_ITEM: u32 = 200;

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
}

// Definición de la estructura de un ítem

#[derive(CandidType, Deserialize, Clone)]
struct Item {
    item: String,
    price: u64,
    description: String,
    rating: Option<Rating>,
    owner: Option<candid::Principal>,
}

// Definición de la estructura para la creación de un ítem

#[derive(CandidType, Deserialize)]
pub struct CreateItem {
    item: String,
    price: u64,
    description: String,
}

// Implementación de trait para la serialización y deserialización de Item

impl Storable for Item {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }
    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

// Implementación de trait para el almacenamiento de ítems

impl BoundedStorable for Item {
    const MAX_SIZE: u32 = MAX_VALUE_SIZE_ITEM;
    const IS_FIXED_SIZE: bool = false;
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

// Métodos de actualización (update) y consulta (query) de la canister
fn caller() -> Result<Principal, ItemError> {
    let caller = ic_cdk::api::caller();
    // El principal anónimo no está permitido para interactuar con el canister.
    if caller == Principal::anonymous() {
        Err(ItemError::Unauthorized)
    } else {
        Ok(caller)
    }
}


#[ic_cdk::update]
fn set_item(item: CreateItem) -> Result<ItemSuccess, ItemError> {
    let id = ID_MANAGER.with(|manager| manager.get_id());
    print!("{}", id);
    let caller = caller()?;
    let value: Item = Item {
        item: item.item,
        price: item.price,
        description: item.description,
        rating: None,
        owner: Some(caller),
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
    let caller = caller()?;
    ITEMS.with(|p| {
        let old_item_opt = p.borrow().get(&id);
        let old_item: Item;

        match old_item_opt {
            Some(value) => old_item = value,
            None => return Err(ItemError::NotExist),
        }

        if let Some(owner) = old_item.owner {
            if caller != owner {
                return Err(ItemError::Unauthorized);
            }
        }
        let value: Item = Item {
            item: item.item,
            price: item.price,
            description: item.description,
            rating: old_item.rating,
            owner: Some(caller),
        };

        let result = p.borrow_mut().insert(id, value);

        match result {
            Some(_) => Ok(()),
            None => Err(ItemError::UpdateError),
        }
    })
}


#[ic_cdk::update]
fn remove_item(id: u64) -> Result<(), ItemError> {
    let caller = caller()?;
    ITEMS.with(|p| {
        let old_item_opt = p.borrow().get(&id);
        let old_item: Item;

        match old_item_opt {
            Some(value) => old_item = value,
            None => return Err(ItemError::NotExist),
        }

        if let Some(owner) = old_item.owner {
            if caller != owner {
                return Err(ItemError::Unauthorized);
            }
        }
        p.borrow_mut().remove(&id);
        Ok(())
    })
}

#[ic_cdk::query]
fn get_items_owner() -> Result<Vec<(u64, Item)>, ItemError> {
    let caller = caller()?; // Envuelve el caller en Some()
    let mut items_owned = Vec::new();

    ITEMS.with(|p| {
        for (id, item) in p.borrow().iter() {
            if item.owner == Some(caller) {
                // Ahora puedes comparar correctamente
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
