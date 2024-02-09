use candid::Principal;
use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};
use serde_derive::Serialize;
use std::{borrow::Cow, cell::RefCell};

// Definición de tipos y constantes
type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_VALUE_SIZE_ITEM: u32 = 5000;
const MAX_VALUE_SIZE_ADDRESS: u32 = 5000;
const MAX_VALUE_SIZE_PURCHASE: u32 = 8000;
const MAX_VALUE_SIZE_MESSAGE: u32 = 5000;
const MAX_VALUE_SIZE_PROFILE: u32 = 5000;

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
    Created,
    Update,
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
pub struct Profile {
    user: Option<Principal>,
    username: String,
    profile_picture: String,
    about: String,



}


impl Storable for Profile {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_PROFILE,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone)]
pub enum MensajeStatus {
    Delivered,
    Read,
    Unread
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Message {
    sender: Option<Principal>,
    content: String,
}

// Implementación de trait para la serialización y deserialización de Item

impl Storable for Message {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_MESSAGE,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone)]
pub struct CreateMessage {
    content: String,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Address {
    country: String,
    state: String,
    postal_code: String,
    phone_number: String,
    city: String,
    address: String,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct UserAddress {
    address_user: Option<Principal>,
    addresses: Option<Vec<Address>>,
}
#[derive(CandidType, Deserialize, Clone)]
pub struct CreateUserAddress {
    address: Address,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct AddressEdit {
    country: Option<String>,
    state: Option<String>,
    postal_code: Option<String>,
    phone_number: Option<String>,
    city: Option<String>,
    address: Option<String>,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct UserAddressEdit {
    address: AddressEdit,
}

// Implementación de trait para la serialización y deserialización de Item

impl Storable for UserAddress {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_ADDRESS,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone)]
pub enum PurchaseStatus {
    Started,
    Paid,
    Shipped,
    Delivered,
    Completed,
    Refunded,
    Disputed,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Purchase {
    item_id: u64,
    amount: u64,
    name: String,
    lastname: String,
    buyer: Option<Principal>,
    account_buyer: String,
    status: PurchaseStatus,
    payment_id: u64,
    seller: Option<Principal>,
    account_seller: String,
    contract_address: String,
    shipping_address: Address,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct CreatePurchase {
    item_id: u64,
    amount: u64,
    name: String,
    lastname: String,
    account_buyer: String,
    payment_id: u64,
    id_shipping_address: u64,
}
// Implementación de trait para la serialización y deserialización de Item

impl Storable for Purchase {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_PURCHASE,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone, PartialEq)]
pub enum Category {
    Electronics,
    ClothingShoesAccessories,
    HomeKitchen,
    BeautyPersonalCare,
    Books,
    SportsOutdoor,
    FoodBeverages,
    HomeImprovement,
    Baby,
    PetsAccessories,
}

impl Category {
    fn from_str(category: &str) -> Option<Self> {
        match category {
            "Electronics" => Some(Category::Electronics),
            "ClothingShoesAccessories" => Some(Category::ClothingShoesAccessories),
            "HomeKitchen" => Some(Category::HomeKitchen),
            "BeautyPersonalCare" => Some(Category::BeautyPersonalCare),
            "Books" => Some(Category::Books),
            "SportsOutdoor" => Some(Category::SportsOutdoor),
            "FoodBeverages" => Some(Category::FoodBeverages),
            "HomeImprovement" => Some(Category::HomeImprovement),
            "Baby" => Some(Category::Baby),
            "PetsAccessories" => Some(Category::PetsAccessories),
            _ => None,
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
    billing_address: String,
    stock: u64,
    category: Category, // Usa la enumeración Category
}

#[derive(CandidType, Deserialize)]
pub struct CreateItem {
    item: String,
    price: u64,
    description: String,
    image: String,
    contract_address: String,
    billing_address: String,
    stock: u64,
    category: String, // Usa la enumeración Category
}

#[derive(CandidType, Deserialize)]
pub struct UpdateItem {
    price: Option<u64>,
    description: Option<String>,
    image: Option<String>,
    stock: Option<u64>,
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

pub struct PurchaseIDManager {
    next_id: std::cell::Cell<u64>,
}

impl PurchaseIDManager {
    pub fn new() -> PurchaseIDManager {
        PurchaseIDManager {
            next_id: std::cell::Cell::new(1),
        }
    }

    pub fn get_id(&self) -> u64 {
        let mut id = self.next_id.get();
        while check_if_purchase_exists(id) {
            id += 1;
        }
        self.next_id.set(id + 1);
        id
    }
}
pub struct AddressIDManager {
    next_id: std::cell::Cell<u64>,
}

impl AddressIDManager {
    pub fn new() -> AddressIDManager {
        AddressIDManager {
            next_id: std::cell::Cell::new(1),
        }
    }

    pub fn get_id(&self) -> u64 {
        let mut id = self.next_id.get();
        while check_if_address_exists(id) {
            id += 1;
        }
        self.next_id.set(id + 1);
        id
    }
}

pub struct MessageIDManager {
    next_id: std::cell::Cell<u64>,
}

impl MessageIDManager {
    pub fn new() -> MessageIDManager  {
        MessageIDManager  {
            next_id: std::cell::Cell::new(1),
        }
    }

    pub fn get_id(&self) -> u64 {
        let mut id = self.next_id.get();
        while check_if_message_exists(id) {
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
    static ADDRESS_BOOK: RefCell<StableBTreeMap<u64, UserAddress, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
    ));

     static PURCHASES: RefCell<StableBTreeMap<u64, Purchase, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),

    ));

    // Supongamos que tienes esta estructura de datos para almacenar las notificaciones
static NOTIFICATIONS: RefCell<StableBTreeMap<u64, Message, Memory>> = RefCell::new(StableBTreeMap::init(
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
));

    static ID_MANAGER: IDManager = IDManager::new();
    static ADDRESS_ID_MANAGER: AddressIDManager = AddressIDManager::new();
    static PURCHASE_ID_MANAGER: PurchaseIDManager = PurchaseIDManager::new();
    static NOTIFICATIONS_ID_MANAGER: MessageIDManager = MessageIDManager::new();
}


#[ic_cdk::update]
fn set_item(item: CreateItem) -> Result<(), ItemError> {
    // Verifica que el stock sea al menos 1
    if item.stock < 1 {
        return Err(ItemError::Unauthorized);
    }

    // Convierte el string a un valor de la enumeración Category
    let category = Category::from_str(&item.category).ok_or(ItemError::NotExist)?;
    let id = ID_MANAGER.with(|manager| manager.get_id());

    let value: Item = Item {
        item: item.item,
        price: item.price,
        description: item.description,
        image: item.image,
        rating: None,
        owner: Some(ic_cdk::api::caller()),
        contract_address: item.contract_address,
        billing_address: item.billing_address,
        stock: item.stock,
        category, // Usa la categoría convertida aquí
    };

    ITEMS.with(|p| p.borrow_mut().insert(id, value.clone()));
    Ok(())
}

#[ic_cdk::update]
fn create_purchase(purchase: CreatePurchase) -> Result<(), ItemError> {
    let id = PURCHASE_ID_MANAGER.with(|manager| manager.get_id());

    let account_seller = get_item_billing_address(purchase.item_id)?;
    let seller_principal = get_item_owner(purchase.item_id)?;
    let contract_address = get_contract_address(purchase.item_id)?;
    let shipping_address = get_address_by_id(purchase.id_shipping_address)?.ok_or(ItemError::NotExist)?;
    let value: Purchase = Purchase {
        item_id: purchase.item_id,
        amount: purchase.amount,
        name: purchase.name,
        lastname: purchase.lastname,
        buyer: Some(ic_cdk::api::caller()),
        account_buyer: purchase.account_buyer,
        status: PurchaseStatus::Paid,
        payment_id: purchase.payment_id,
        seller: Some(seller_principal),
        account_seller: account_seller,
        contract_address: contract_address,
        shipping_address: shipping_address,
    };

    PURCHASES.with(|p| p.borrow_mut().insert(id, value.clone()));

    let _call_result: Result<(), _> = ic_cdk::notify(seller_principal, "purchase_made", (&value,));
    Ok(())
}

#[ic_cdk::query]
fn get_your_sales() -> Result<Vec<Purchase>, ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let mut sales = Vec::new();

    PURCHASES.with(|p| {
        let purchases = p.borrow();

        for purchase in purchases.iter().map(|(_, v)| v) {
            if let Some(seller) = purchase.seller {
                if seller == caller_principal {
                    sales.push(purchase.clone());
                }
            }
        }
    });

    if sales.is_empty() {
        return Err(ItemError::NotExist);
    }

    Ok(sales)
}


#[ic_cdk::query]
fn get_your_purchases() -> Result<Vec<Purchase>, ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let mut purchases = Vec::new();

    PURCHASES.with(|p| {
        let purchases_map = p.borrow();

        for purchase in purchases_map.iter().map(|(_, v)| v) {
            if purchase.buyer == Some(caller_principal) {
                purchases.push(purchase.clone());
            }
        }
    });

    if purchases.is_empty() {
        return Err(ItemError::NotExist);
    }

    Ok(purchases)
}



#[ic_cdk::update]
fn purchase_item(id: u64, quantity: u64) -> Result<ItemSuccess, ItemError> {
    ITEMS.with(|p| {
        let mut items = p.borrow_mut();
        if let Some(mut item) = items.remove(&id) {
            if item.stock < quantity {
                // Vuelve a insertar el item si no hay suficiente stock
                items.insert(id, item);
                return Err(ItemError::Unauthorized);
            }
            item.stock -= quantity;
            items.insert(id, item);
            Ok(ItemSuccess::Update)
        } else {
            Err(ItemError::NotExist)
        }
    })
}

#[ic_cdk::update]
fn associate_address(new_address: CreateUserAddress) -> Result<ItemSuccess, ItemError> {
    // Buscar si el usuario ya tiene una entrada en la libreta de direcciones
    let mut found = false;
    let id = ADDRESS_ID_MANAGER.with(|manager| manager.get_id());
    ADDRESS_BOOK.with(|book| {
        let mut book = book.borrow_mut();
        if let Some(mut user_address) = book.remove(&id) {
            // Si el usuario ya existe, añadir la nueva dirección a su lista de direcciones
            if let Some(addresses) = &mut user_address.addresses {
                addresses.push(new_address.address.clone());
            } else {
                user_address.addresses = Some(vec![new_address.address.clone()]);
            }
            book.insert(id, user_address);
            found = true;
        }
    });

    // Si el usuario no existe en la libreta de direcciones, crear una nueva entrada
    if !found {
        let user_address = UserAddress {
            address_user: Some(ic_cdk::api::caller()),
            addresses: Some(vec![new_address.address]),
        };
        ADDRESS_BOOK.with(|book| book.borrow_mut().insert(id, user_address));
    }

    Ok(ItemSuccess::Created)
}

#[ic_cdk::query]
fn get_contract_address(item_id: u64) -> Result<String, ItemError> {
    let item_opt = ITEMS.with(|p| p.borrow().get(&item_id));
    match item_opt {
        Some(item) => Ok(item.contract_address.clone()),
        None => Err(ItemError::NotExist),
    }
}

#[ic_cdk::query]
fn get_item_billing_address(item_id: u64) -> Result<String, ItemError> {
    let item_opt = ITEMS.with(|p| p.borrow().get(&item_id));
    match item_opt {
        Some(item) => Ok(item.billing_address.clone()),
        None => Err(ItemError::NotExist),
    }
}

#[ic_cdk::query]
fn get_item_owner(item_id: u64) -> Result<Principal, ItemError> {
    let item_opt = ITEMS.with(|p| p.borrow().get(&item_id));
    match item_opt {
        Some(item) => match &item.owner {
            Some(owner) => Ok(owner.clone()),
            None => Err(ItemError::NotExist),
        },
        None => Err(ItemError::NotExist),
    }
}

#[ic_cdk::query]
fn get_user_addresses() -> Result<Vec<(u64, Address)>, ItemError> {
    let user_principal = ic_cdk::api::caller();

    // Buscar si el usuario tiene una entrada en la libreta de direcciones
    let mut addresses = Vec::new();
    ADDRESS_BOOK.with(|book| {
        let book = book.borrow();
        for (id, user_address) in book.iter() {
            if user_address.address_user == Some(user_principal) {
                // Si el usuario existe, añadir todas sus direcciones al vector con su respectivo ID
                if let Some(user_addresses) = &user_address.addresses {
                    for address in user_addresses.iter() {
                        addresses.push((id, address.clone()));
                    }
                }
            }
        }
    });

    Ok(addresses)
}

#[ic_cdk::query]
fn get_address_by_id(id: u64) -> Result<Option<Address>, ItemError> {
    let user_principal = ic_cdk::api::caller();

    // Buscar si el usuario tiene una entrada en la libreta de direcciones
    ADDRESS_BOOK.with(|book| {
        let book = book.borrow();
        for (book_id, user_address) in book.iter() {
            if book_id == id {
                if user_address.address_user == Some(user_principal) {
                    // Si el usuario existe y el ID coincide, obtener la dirección asociada
                    if let Some(user_addresses) = &user_address.addresses {
                        for addr in user_addresses.iter() {
                            return Ok(Some(addr.clone()));
                        }
                    }
                } else {
                    // Si el ID coincide pero el usuario no es el Principal asociado, devolver un error
                    return Err(ItemError::Unauthorized);
                }
            }
        }
        // Si no se encontró ninguna dirección, devolver un error
        Err(ItemError::NotExist)
    })
}

#[ic_cdk::update]
fn update_address(id: u64, new_address: UserAddressEdit) -> Result<(), ItemError> {
    let caller_principal = ic_cdk::api::caller();
    ADDRESS_BOOK.with(|p| {
        let old_address_opt = p.borrow().get(&id);
        let old_address: UserAddress;

        match old_address_opt {
            Some(value) => old_address = value,
            None => return Err(ItemError::NotExist),
        }

        if let Some(address_user) = old_address.address_user {
            if caller_principal != address_user {
                return Err(ItemError::Unauthorized);
            }
        }

        let old_address_data = old_address
            .addresses
            .unwrap_or(vec![])
            .get(0)
            .unwrap_or(&Address {
                country: "".to_string(),
                state: "".to_string(),
                postal_code: "".to_string(),
                phone_number: "".to_string(),
                city: "".to_string(),
                address: "".to_string(),
            })
            .clone();

        let value: UserAddress = UserAddress {
            address_user: Some(caller_principal),
            addresses: Some(vec![Address {
                country: new_address
                    .address
                    .country
                    .unwrap_or_else(|| old_address_data.country.clone()),
                state: new_address
                    .address
                    .state
                    .unwrap_or_else(|| old_address_data.state.clone()),
                postal_code: new_address
                    .address
                    .postal_code
                    .unwrap_or_else(|| old_address_data.postal_code.clone()),
                phone_number: new_address
                    .address
                    .phone_number
                    .unwrap_or_else(|| old_address_data.phone_number.clone()),
                city: new_address
                    .address
                    .city
                    .unwrap_or_else(|| old_address_data.city.clone()),
                address: new_address
                    .address
                    .address
                    .unwrap_or_else(|| old_address_data.address.clone()),
            }]),
        };

        let result = p.borrow_mut().insert(id, value);

        match result {
            Some(_) => Ok(()),
            None => Err(ItemError::UpdateError),
        }
    })
}

#[ic_cdk::query]
fn check_if_item_exists(id: u64) -> bool {
    ITEMS.with(|p| p.borrow().contains_key(&id))
}
#[ic_cdk::query]
fn check_if_address_exists(id: u64) -> bool {
    ADDRESS_BOOK.with(|p| p.borrow().contains_key(&id))
}

#[ic_cdk::query]
fn check_if_purchase_exists(id: u64) -> bool {
    PURCHASES.with(|p| p.borrow().contains_key(&id))
}

#[ic_cdk::query]
fn check_if_message_exists(id: u64) -> bool {
    NOTIFICATIONS.with(|p| p.borrow().contains_key(&id))
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
#[ic_cdk::query]
fn get_items_by_category(category: String) -> Vec<Item> {
    let mut items_in_category = Vec::new();
    let category = Category::from_str(&category);
    if let Some(category) = category {
        ITEMS.with(|p| {
            for (_, item) in p.borrow().iter() {
                if item.category == category {
                    items_in_category.push(item.clone());
                }
            }
        });
    }
    items_in_category
}

#[ic_cdk::update]
fn update_item(id: u64, item: UpdateItem) -> Result<(), ItemError> {
    ITEMS.with(|p| {
        let old_item_opt = p.borrow().get(&id);
        let old_item: Item;

        match old_item_opt {
            Some(value) => old_item = value,
            None => return Err(ItemError::NotExist),
        }

        if let Some(owner) = old_item.owner {
            if owner != ic_cdk::api::caller() {
                return Err(ItemError::Unauthorized);
            }
        }
        let value: Item = Item {
            item: old_item.item,
            price: item.price.unwrap_or(old_item.price),
            description: item.description.unwrap_or(old_item.description),
            image: item.image.unwrap_or(old_item.image),
            rating: old_item.rating,
            owner: old_item.owner,
            contract_address: old_item.contract_address,
            billing_address: old_item.billing_address,
            stock: item.stock.unwrap_or(old_item.stock),
            category: old_item.category,
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
    ITEMS.with(|p| {
        let old_item_opt = p.borrow().get(&id);
        let old_item: Item;

        match old_item_opt {
            Some(value) => old_item = value,
            None => return Err(ItemError::NotExist),
        }

        if let Some(owner) = old_item.owner {
            if owner != ic_cdk::api::caller() {
                return Err(ItemError::Unauthorized);
            }
        }
        p.borrow_mut().remove(&id);
        Ok(())
    })
}

#[ic_cdk::query]
fn get_items_owner() -> Result<Vec<(u64, Item)>, ItemError> {
    let caller_principal = ic_cdk::api::caller(); // Usa la función string_a_principal para convertir el String owner a un Principal
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
