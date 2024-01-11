use candid::{candid_method, CandidType, Decode, Deserialize, Encode};
use candid::Principal;
use std::{borrow::Cow, cell::RefCell};
use b3_utils::caller_is_controller;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, StableBTreeMap, Storable};
use serde_derive::Serialize;

type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_VALUE_SIZE_PAYMENT: u32 = 200;
// Define una nueva estructura para los elementos
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash, PartialEq)]
pub struct Item {
    item: String,
    price: u64,
    description: String,
}


impl Storable for Item {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for Item {
    const MAX_SIZE: u32 = MAX_VALUE_SIZE_PAYMENT;
    const IS_FIXED_SIZE: bool = false;
}


thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
    RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    static ITEMS: RefCell<StableBTreeMap<u64, Item, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
    ));
}

#[ic_cdk::update(guard = "caller_is_controller")]
fn set_item(id: u64, item: Item) {
    ITEMS.with(|p| p.borrow_mut().insert(id, item));
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
fn remove_item(id: u64) {
    ITEMS.with(|p| p.borrow_mut().remove(&id));
}


#[ic_cdk::query]
fn whoami() -> Principal {
    ic_cdk::api::caller()
}