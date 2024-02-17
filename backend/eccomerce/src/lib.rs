use b3_utils::{call, caller_is_controller};
use candid::Principal;
use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{
    storable::Bound, BTreeMap, DefaultMemoryImpl, StableBTreeMap, Storable,
};

use serde_derive::Serialize;
use std::collections::HashMap;
use std::{borrow::Cow, cell::RefCell};

use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
    TransformContext,
};

type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_VALUE_SIZE_ITEM: u32 = 5000;
const MAX_VALUE_SIZE_ADDRESS: u32 = 5000;
const MAX_VALUE_SIZE_PURCHASE: u32 = 8000;
const MAX_VALUE_SIZE_MESSAGE: u32 = 5000;
const MAX_VALUE_SIZE_PROFILE: u32 = 5000;
const MAX_VALUE_SIZE_PRINCIPAL: u32 = 200;
const MAX_VALUE_SIZE_USER_MESSAGES: u32 = 800;
const MAX_VALUE_SIZE_FCM_TOKENS: u32 = 8000;

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
    InvalidRating,
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
pub struct Review {
    rating: Rating,
    review: String,
    reviewer: Option<Principal>,
}
#[derive(CandidType, Deserialize)]
pub struct CreateReview {
    item_id: u64,
    rating: u64,
    review: String,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Profile {
    user: Option<Principal>,
    username: String,
    profile_picture: String,
    about: String,
    active: bool,                 // Nuevo campo para el estado de actividad
    last_connection: Option<u64>, // Nuevo campo para la última conexión
}

#[derive(CandidType, Deserialize, Clone)]
pub struct CreateProfile {
    username: String,
    profile_picture: String, // Ahora es String en lugar de Option<String>
    about: String,           // Ahora es String en lugar de Option<String>
}

#[derive(CandidType, Deserialize, Clone)]
pub struct AddProfilePicture {
    profile_picture: String,
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
pub struct FcmTokens {
    tokens: Vec<String>,
}

impl Storable for FcmTokens {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_FCM_TOKENS,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone, PartialEq)]
pub enum MensajeStatus {
    Sent,
    Read,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Message {
    sender: Option<Principal>,
    content: String,
    addressee: Option<Principal>,
    time: u64, // Tiempo Unix en milisegundos
    status: MensajeStatus,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct UserMessages {
    messages: Vec<Message>,
    last_checked: u64, // Cambia a u64
    unread: u64, // Cambia a u64
}

impl Storable for UserMessages {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_USER_MESSAGES,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone)]
pub struct SendMessage {
    content: String,
    addressee: Principal,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Conversation {
    other_user: Principal,
    last_message: Message,
    unread: bool,
    unread_count: u64, // Nuevo campo para el número de mensajes no leídos
}

#[derive(CandidType, Deserialize, Clone, PartialEq, PartialOrd, Eq, Ord)]
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

#[derive(CandidType, Deserialize, Clone)]
pub struct InboxResult {
    conversations: Vec<Conversation>,
    total_unread_chats: u64,
}

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

#[derive(CandidType, Deserialize, Clone, PartialEq)]
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
    id_shipping_address: u64, // Cambia usize a u64
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
    reviews: Vec<Review>,
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


thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    static ITEMS: RefCell<StableBTreeMap<u64, Item, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),

    ));
    // Cambia el tipo de clave de u64 a Principal
static ADDRESS_BOOK: RefCell<StableBTreeMap<KeyPrincipal, UserAddress, Memory>> = RefCell::new(StableBTreeMap::init(
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
));

     static PURCHASES: RefCell<StableBTreeMap<u64, Purchase, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),

    ));

    // Cambia el tipo de clave de u64 a Principal
static PROFILES: RefCell<StableBTreeMap<KeyPrincipal, Profile, Memory>> = RefCell::new(StableBTreeMap::init(
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
));
    static LAST_SEEN: RefCell<StableBTreeMap<KeyPrincipal, u64, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(4))),
    ));
 
    static USER_MESSAGES: RefCell<StableBTreeMap<KeyPrincipal, UserMessages, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(5))),
    ));

        // Cambia el tipo de clave de u64 a Principal
static FCM_TOKENS: RefCell<StableBTreeMap<KeyPrincipal, FcmTokens, Memory>> = RefCell::new(StableBTreeMap::init(
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
));



    static ID_MANAGER: IDManager = IDManager::new();
    static PURCHASE_ID_MANAGER: PurchaseIDManager = PurchaseIDManager::new();
}

#[ic_cdk::init]
fn create_profile_canister(profile: CreateProfile) {
    let caller_principal = ic_cdk::id();
    let key_principal = KeyPrincipal { key: caller_principal }; // Crea un KeyPrincipal

    let value: Profile = Profile {
        user: Some(caller_principal),
        username: profile.username,
        profile_picture: profile.profile_picture, // Ahora es String
        about: profile.about,                     // Ahora es String
        active: false,
        last_connection: None,
    };

    // Usa KeyPrincipal en lugar de id
    PROFILES.with(|p| p.borrow_mut().insert(key_principal, value));
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
        reviews: Vec::new(), // Inicializa reviews como un vector vacío
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
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal { key: caller_principal }; // Crea un KeyPrincipal

    // Buscar si el usuario tiene una entrada en la libreta de direcciones
    let user_address_opt = ADDRESS_BOOK.with(|book| book.borrow().get(&key_principal));
    let user_address = user_address_opt.ok_or(ItemError::NotExist)?;

    // Obtener la dirección de envío específica usando el índice proporcionado
    let shipping_address = user_address.addresses
        .as_ref()
        .and_then(|addresses| addresses.get(purchase.id_shipping_address as usize)) // Convierte u64 a usize
        .ok_or(ItemError::NotExist)?
        .clone();

    let id = PURCHASE_ID_MANAGER.with(|manager| manager.get_id());

    let account_seller = get_item_billing_address(purchase.item_id)?;
    let seller_principal = get_item_owner(purchase.item_id)?;
    let contract_address = get_contract_address(purchase.item_id)?;

    let value: Purchase = Purchase {
        item_id: purchase.item_id,
        amount: purchase.amount,
        name: purchase.name,
        lastname: purchase.lastname,
        buyer: Some(caller_principal),
        account_buyer: purchase.account_buyer,
        status: PurchaseStatus::Started,
        payment_id: purchase.payment_id,
        seller: Some(seller_principal),
        account_seller: account_seller,
        contract_address: contract_address,
        shipping_address: shipping_address,
    };

    PURCHASES.with(|p| p.borrow_mut().insert(id, value.clone()));

    Ok(())
}


#[ic_cdk::update]
fn send_message(message: SendMessage) -> Result<(), ItemError> {
    let sender = ic_cdk::api::caller();
    let new_message = Message {
        sender: Some(sender.clone()),
        content: message.content,
        addressee: Some(message.addressee.clone()),
        time: ic_cdk::api::time(),
        status: MensajeStatus::Sent,
    };

    // Añade el nuevo mensaje a los mensajes del usuario receptor
    USER_MESSAGES.with(|um| {
        let mut um = um.borrow_mut();
        let mut user_messages = um.get(&KeyPrincipal { key: message.addressee.clone() }).clone().unwrap_or(UserMessages { messages: vec![], last_checked: 0, unread: 0 });
        user_messages.messages.push(new_message.clone());
        um.insert(KeyPrincipal { key: message.addressee.clone() }, user_messages);
    });

    // Añade el nuevo mensaje a los mensajes del usuario que envía
    USER_MESSAGES.with(|um| {
        let mut um = um.borrow_mut();
        let mut user_messages = um.get(&KeyPrincipal { key: sender }).clone().unwrap_or(UserMessages { messages: vec![], last_checked: 0, unread: 0 });
        user_messages.messages.push(new_message);
        um.insert(KeyPrincipal { key: sender }, user_messages);
    });

    // Inicializa last_seen a 0 para el receptor del mensaje
    LAST_SEEN.with(|ls| {
        let mut ls = ls.borrow_mut();
        ls.insert(KeyPrincipal { key: message.addressee.clone() }, 0);
    });

    // Inicializa last_seen a 0 para el remitente del mensaje
    LAST_SEEN.with(|ls| {
        let mut ls = ls.borrow_mut();
        ls.insert(KeyPrincipal { key: sender }, 0);
    });

    Ok(())
}


#[ic_cdk::update]
fn send_message_by_canister(message: SendMessage) -> Result<(), ItemError> {
    let sender = ic_cdk::id(); // El remitente es el Principal del canister
    let new_message = Message {
        sender: Some(sender.clone()),
        content: message.content,
        addressee: Some(message.addressee.clone()),
        time: ic_cdk::api::time(),
        status: MensajeStatus::Sent,
    };

    // Añade el nuevo mensaje a los mensajes del usuario receptor
    USER_MESSAGES.with(|um| {
        let mut um = um.borrow_mut();
        let mut user_messages = um.get(&KeyPrincipal { key: message.addressee.clone() }).clone().unwrap_or(UserMessages { messages: vec![], last_checked: 0, unread: 0 });
        user_messages.messages.push(new_message.clone());
        um.insert(KeyPrincipal { key: message.addressee.clone() }, user_messages);
    });

    // Añade el nuevo mensaje a los mensajes del canister
    USER_MESSAGES.with(|um| {
        let mut um = um.borrow_mut();
        let mut user_messages = um.get(&KeyPrincipal { key: sender }).clone().unwrap_or(UserMessages { messages: vec![], last_checked: 0, unread: 0 });
        user_messages.messages.push(new_message);
        um.insert(KeyPrincipal { key: sender }, user_messages);
    });

    // Inicializa last_seen a 0 para el receptor del mensaje
    LAST_SEEN.with(|ls| {
        let mut ls = ls.borrow_mut();
        ls.insert(KeyPrincipal { key: message.addressee.clone() }, 0);
    });

    // Inicializa last_seen a 0 para el canister
    LAST_SEEN.with(|ls| {
        let mut ls = ls.borrow_mut();
        ls.insert(KeyPrincipal { key: sender }, 0);
    });

    Ok(())
}

#[ic_cdk::update]
fn add_token_to_principal(token: String) -> Result<(), ItemError> {
    // Obtiene el Principal de quien llama a la función
    let caller = ic_cdk::api::caller();
    let principal = KeyPrincipal { key: caller };

    FCM_TOKENS.with(|fcm_tokens_map| {
        let mut fcm_tokens_map = fcm_tokens_map.borrow_mut();

        if let Some(fcm_tokens) = fcm_tokens_map.get(&principal) {
            // Si el token ya existe para el Principal, retorna un error.
            if fcm_tokens.tokens.contains(&token) {
                return Err(ItemError::AlreadyExist);
            }

            // Si el token no existe, clona los tokens, agrega el nuevo token y vuelve a insertarlos.
            let mut new_tokens = fcm_tokens.tokens.clone();
            new_tokens.push(token);
            let new_fcm_tokens = FcmTokens { tokens: new_tokens };
            fcm_tokens_map.insert(principal, new_fcm_tokens);
        } else {
            // Si el Principal no existe en el mapa, crea una nueva entrada.
            let fcm_tokens = FcmTokens {
                tokens: vec![token],
            };
            fcm_tokens_map.insert(principal, fcm_tokens);
        }

        Ok(())
    })
}


#[ic_cdk::query]
fn get_inbox() -> Result<InboxResult, ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let mut conversations: HashMap<Principal, (Message, u64, bool)> = HashMap::new();
    let mut total_unread_chats = 0;

    let user_messages = USER_MESSAGES.with(|um| {
        let um = um.borrow();
        um.get(&KeyPrincipal { key: caller_principal }).clone()
    });

    let mut user_messages = match user_messages {
        Some(user_messages) => user_messages,
        None => return Err(ItemError::NotExist), // Devuelve un error si el usuario no existe
    };

    for message in &user_messages.messages[user_messages.last_checked as usize..] {
        let other_user = if message.addressee == Some(caller_principal) {
            message.sender.unwrap()
        } else {
            message.addressee.unwrap()
        };

        if let Some((existing_message, existing_unread_count, existing_unread)) =
            conversations.get(&other_user)
        {
            let new_unread_count = if message.status == MensajeStatus::Sent {
                existing_unread_count + 1
            } else {
                *existing_unread_count
            };
            let new_unread = if message.status == MensajeStatus::Sent {
                true
            } else {
                *existing_unread
            };
            if existing_message.time < message.time {
                conversations
                    .insert(other_user, (message.clone(), new_unread_count, new_unread));
            }
        } else {
            let new_unread_count = if message.status == MensajeStatus::Sent {
                1
            } else {
                0
            };
            let new_unread = if message.status == MensajeStatus::Sent {
                true
            } else {
                false
            };
            conversations
                .insert(other_user, (message.clone(), new_unread_count, new_unread));
        }

        if message.status == MensajeStatus::Sent {
            user_messages.unread += 1;
            total_unread_chats += 1;
        }
    }

    // Si conversations está vacío, añade el último mensaje comprobado
    if conversations.is_empty() && !user_messages.messages.is_empty() {
        let last_message = &user_messages.messages[user_messages.last_checked as usize - 1];
        let other_user = if last_message.addressee == Some(caller_principal) {
            last_message.sender.unwrap()
        } else {
            last_message.addressee.unwrap()
        };
        conversations.insert(other_user, (last_message.clone(), 0, false));
    }

    // Actualiza last_checked
    user_messages.last_checked = user_messages.messages.len() as u64;

    // Vuelve a insertar user_messages en el mapa
    USER_MESSAGES.with(|um| {
        let mut um = um.borrow_mut();
        um.insert(KeyPrincipal { key: caller_principal }, user_messages);
    });

    let conversations: Vec<Conversation> = conversations
        .into_iter()
        .map(
            |(other_user, (last_message, unread_count, unread))| Conversation {
                other_user,
                last_message,
                unread_count,
                unread,
            },
        )
        .collect();
    Ok(InboxResult {
        conversations,
        total_unread_chats,
    })
}


#[ic_cdk::query]
fn get_private_chat(other_user: Principal) -> Result<Vec<Message>, ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let mut messages = Vec::new();

    // Recoge todos los mensajes entre el usuario actual y other_user
    USER_MESSAGES.with(|um| {
        let um = um.borrow();

        if let Some(user_messages) = um.get(&KeyPrincipal { key: caller_principal }) {
            for message in &user_messages.messages {
                if (message.addressee == Some(caller_principal) && message.sender == Some(other_user.clone()))
                    || (message.addressee == Some(other_user.clone())
                        && message.sender == Some(caller_principal.clone()))
                {
                    messages.push(message.clone());
                }
            }
        }
    });

    if messages.is_empty() {
        return Err(ItemError::NotExist);
    }

    // Ordena los mensajes por tiempo en orden ascendente para ver los más antiguos primero
    messages.sort_by(|a, b| a.time.cmp(&b.time));

    Ok(messages)
}

#[ic_cdk::update]
async fn mark_messages_as_read(other_user: Principal) -> Result<(), ItemError> {
    let caller_principal = ic_cdk::api::caller();

    USER_MESSAGES.with(|um| {
        let mut um = um.borrow_mut();

        if let Some(mut user_messages) = um.get(&KeyPrincipal { key: caller_principal }).clone() {
            // Obtiene el último mensaje visto en esta conversación
            let last_seen = LAST_SEEN.with(|ls| {
                let ls = ls.borrow();
                ls.get(&KeyPrincipal { key: other_user.clone() }).unwrap_or(0).clone()
            });

            for (i, message) in user_messages.messages.iter_mut().enumerate() {
                if i < last_seen as usize {
                    continue; // Salta los mensajes ya vistos
                }

                if (message.addressee == Some(caller_principal) && message.sender == Some(other_user.clone()))
                    || (message.addressee == Some(other_user.clone()) && message.sender == Some(caller_principal))
                    && message.status != MensajeStatus::Read
                {
                    message.status = MensajeStatus::Read;
                    LAST_SEEN.with(|ls| {
                        let mut ls = ls.borrow_mut();
                        ls.insert(KeyPrincipal { key: other_user.clone() }, i as u64); // Actualiza el último mensaje visto
                    });
                }
            }

            // Vuelve a insertar el UserMessages actualizado en el mapa
            um.insert(KeyPrincipal { key: caller_principal }, user_messages.clone());

            // Actualiza los mensajes en la lista de mensajes del otro usuario
            if let Some(mut other_user_messages) = um.get(&KeyPrincipal { key: other_user.clone() }).clone() {
                for message in other_user_messages.messages.iter_mut() {
                    if (message.addressee == Some(other_user.clone()) && message.sender == Some(caller_principal))
                        || (message.addressee == Some(caller_principal) && message.sender == Some(other_user.clone()))
                        && message.status != MensajeStatus::Read
                    {
                        message.status = MensajeStatus::Read;
                    }
                }

                // Vuelve a insertar el UserMessages actualizado en el mapa
                um.insert(KeyPrincipal { key: other_user.clone() }, other_user_messages);
            }
        }
    });

    Ok(())
}


#[ic_cdk::update]
fn add_review(review: CreateReview) -> Result<(), ItemError> {
    let purchase_opt = ITEMS.with(|p| p.borrow().get(&review.item_id).clone());

    if let Some(mut item) = purchase_opt {
        if item.owner == Some(ic_cdk::api::caller()) {
            return Err(ItemError::Unauthorized); // El dueño del item no puede realizar una valoración
        }

        // Comprueba si el usuario que llama ya ha dejado una valoración
        if item
            .reviews
            .iter()
            .any(|r| r.reviewer == Some(ic_cdk::api::caller()))
        {
            return Err(ItemError::AlreadyVoted);
        }

        let rating = Rating::from_value(review.rating).ok_or(ItemError::InvalidRating)?;
        let new_review = Review {
            rating,
            review: review.review,
            reviewer: Some(ic_cdk::api::caller()),
        };

        item.reviews.push(new_review);
        ITEMS.with(|p| p.borrow_mut().insert(review.item_id, item));
        Ok(())
    } else {
        Err(ItemError::NotExist)
    }
}

#[ic_cdk::update]
fn update_purchase_status_to_paid(id: u64) -> Result<(), ItemError> {
    let purchase_opt = PURCHASES.with(|p| p.borrow().get(&id).clone());

    if let Some(mut purchase) = purchase_opt {
        if purchase.buyer != Some(ic_cdk::api::caller()) {
            return Err(ItemError::Unauthorized);
        }

        purchase.status = PurchaseStatus::Paid;
        PURCHASES.with(|p| p.borrow_mut().insert(id, purchase));
        Ok(())
    } else {
        Err(ItemError::NotExist)
    }
}

#[ic_cdk::update]
fn update_purchase_status_to_shipped(id: u64) -> Result<(), ItemError> {
    let purchase_opt = PURCHASES.with(|p| p.borrow().get(&id).clone());

    if let Some(mut purchase) = purchase_opt {
        if purchase.seller != Some(ic_cdk::api::caller()) {
            return Err(ItemError::Unauthorized);
        }

        purchase.status = PurchaseStatus::Shipped;
        PURCHASES.with(|p| p.borrow_mut().insert(id, purchase.clone()));

        // Envía un mensaje al comprador
        if let Some(buyer_principal) = purchase.buyer {
            let message = SendMessage {
                content: format!("¡Buenas noticias! Tu producto ha sido enviado. ID de la compra: {}", id),
                addressee: buyer_principal,
            };
            send_message_by_canister(message)?;
        }

        Ok(())
    } else {
        Err(ItemError::NotExist)
    }
}

#[ic_cdk::update]
fn update_purchase_status_to_delivered(id: u64) -> Result<(), ItemError> {
    let purchase_opt = PURCHASES.with(|p| p.borrow().get(&id).clone());

    if let Some(mut purchase) = purchase_opt {
        if purchase.buyer != Some(ic_cdk::api::caller()) {
            return Err(ItemError::Unauthorized);
        }

        purchase.status = PurchaseStatus::Delivered;
        PURCHASES.with(|p| p.borrow_mut().insert(id, purchase));
        Ok(())
    } else {
        Err(ItemError::NotExist)
    }
}

#[ic_cdk::update]
fn update_purchase_status_to_completed(id: u64) -> Result<(), ItemError> {
    let purchase_opt = PURCHASES.with(|p| p.borrow().get(&id).clone());

    if let Some(mut purchase) = purchase_opt {
        if purchase.buyer != Some(ic_cdk::api::caller()) {
            return Err(ItemError::Unauthorized);
        }

        purchase.status = PurchaseStatus::Completed;
        PURCHASES.with(|p| p.borrow_mut().insert(id, purchase));
        Ok(())
    } else {
        Err(ItemError::NotExist)
    }
}

#[ic_cdk::update]
fn update_purchase_status_to_refunded(id: u64) -> Result<(), ItemError> {
    let purchase_opt = PURCHASES.with(|p| p.borrow().get(&id).clone());

    if let Some(mut purchase) = purchase_opt {
        if purchase.buyer != Some(ic_cdk::api::caller()) {
            return Err(ItemError::Unauthorized);
        }

        purchase.status = PurchaseStatus::Refunded;
        PURCHASES.with(|p| p.borrow_mut().insert(id, purchase));
        Ok(())
    } else {
        Err(ItemError::NotExist)
    }
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

#[ic_cdk::query]
fn has_profile() -> bool {
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal { key: caller_principal }; // Crea un KeyPrincipal
    PROFILES.with(|p| {
        // Usa KeyPrincipal en lugar de Principal
        p.borrow().get(&key_principal).is_some()
    })
}

#[ic_cdk::update]
fn create_profile(profile: CreateProfile) -> Result<(), ItemError> {
    let caller_principal = ic_cdk::api::caller();
    if has_profile() {
        return Err(ItemError::AlreadyExist);
    }

    let value: Profile = Profile {
        user: Some(caller_principal),
        username: profile.username,
        profile_picture: profile.profile_picture,
        about: profile.about,
        active: false,
        last_connection: None,
    };

    let key_principal = KeyPrincipal { key: caller_principal }; // Crea un KeyPrincipal
    // Usa KeyPrincipal en lugar de Principal
    PROFILES.with(|p| p.borrow_mut().insert(key_principal, value));
    Ok(())
}
#[ic_cdk::update]
fn add_picture(picture: AddProfilePicture) -> Result<(), ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal { key: caller_principal }; // Crea un KeyPrincipal

    PROFILES.with(|p| {
        let old_profile_opt = p.borrow().get(&key_principal);
        let old_profile: Profile;

        match old_profile_opt {
            Some(value) => old_profile = value.clone(),
            None => return Err(ItemError::NotExist),
        }

        let value: Profile = Profile {
            user: old_profile.user,
            username: old_profile.username,
            profile_picture: picture.profile_picture,
            about: old_profile.about,
            active: old_profile.active,
            last_connection: old_profile.last_connection,
        };

        // Usa KeyPrincipal en lugar de id
        let result = p.borrow_mut().insert(key_principal, value);

        match result {
            Some(_) => Ok(()),
            None => Err(ItemError::UpdateError),
        }
    })
}


#[ic_cdk::query]
fn get_user_profile() -> Result<Profile, ItemError> {
    let user_principal = ic_cdk::api::caller();

    // Buscar si el usuario tiene un perfil
    PROFILES.with(|profiles| {
        let profiles = profiles.borrow();
        for (_id, profile) in profiles.iter() {
            if profile.user == Some(user_principal) {
                // Si el usuario existe, devolver su perfil
                return Ok(profile.clone());
            }
        }
        // Si no se encontró un perfil, devolver un error
        Err(ItemError::NotExist)
    })
}
#[ic_cdk::query]
fn get_profile_by_principal(principal: Principal) -> Result<Profile, ItemError> {
    // Buscar si el usuario tiene un perfil
    PROFILES.with(|profiles| {
        let profiles = profiles.borrow();
        for (_id, profile) in profiles.iter() {
            if profile.user == Some(principal) {
                // Si el usuario existe, devolver su perfil
                return Ok(profile.clone());
            }
        }
        // Si no se encontró un perfil, devolver un error
        Err(ItemError::NotExist)
    })
}
#[ic_cdk::query]
fn get_profile_key_by_principal(principal: Principal) -> Result<Profile, ItemError> {
    let key_principal = KeyPrincipal { key: principal }; // Crea un KeyPrincipal

    PROFILES.with(|profiles| {
        // Intenta obtener el perfil directamente usando el KeyPrincipal
        match profiles.borrow().get(&key_principal) {
            Some(profile) => Ok(profile.clone()), // Si el perfil existe, devolverlo
            None => Err(ItemError::NotExist), // Si no se encontró un perfil, devolver un error
        }
    })
}


#[ic_cdk::update]
fn activate_profile() -> Result<(), ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal { key: caller_principal }; // Crea un KeyPrincipal

    PROFILES.with(|profiles| {
        let mut profiles = profiles.borrow_mut();
        if let Some(profile) = profiles.get(&key_principal) {
            let mut updated_profile = profile.clone();
            updated_profile.active = true;
            profiles.insert(key_principal, updated_profile); // Usa KeyPrincipal en lugar de id
            Ok(())
        } else {
            Err(ItemError::NotExist)
        }
    })
}

#[ic_cdk::update]
fn desactivate_profile() -> Result<(), ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal { key: caller_principal }; // Crea un KeyPrincipal

    PROFILES.with(|profiles| {
        let mut profiles = profiles.borrow_mut();
        if let Some(profile) = profiles.get(&key_principal) {
            let mut updated_profile = profile.clone();
            updated_profile.active = false;
            updated_profile.last_connection = Some(ic_cdk::api::time());
            profiles.insert(key_principal, updated_profile); // Usa KeyPrincipal en lugar de id
            Ok(())
        } else {
            Err(ItemError::NotExist)
        }
    })
}

#[ic_cdk::query]
fn is_active(principal: Principal) -> Result<bool, ItemError> {
    let profile = get_profile_by_principal(principal)?;
    Ok(profile.active)
}

#[ic_cdk::update]
fn associate_address(new_address: CreateUserAddress) -> Result<ItemSuccess, ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal { key: caller_principal }; // Crea un KeyPrincipal

    ADDRESS_BOOK.with(|book| {
        let mut book = book.borrow_mut();
        if let Some(mut user_address) = book.remove(&key_principal) {
            // Si el usuario ya existe, añadir la nueva dirección a su lista de direcciones
            if let Some(addresses) = &mut user_address.addresses {
                addresses.push(new_address.address.clone());
            } else {
                user_address.addresses = Some(vec![new_address.address.clone()]);
            }
            book.insert(key_principal, user_address); // Usa KeyPrincipal en lugar de id
        } else {
            // Si el usuario no existe en la libreta de direcciones, crear una nueva entrada
            let user_address = UserAddress {
                address_user: Some(caller_principal),
                addresses: Some(vec![new_address.address]),
            };
            book.insert(key_principal, user_address); // Usa KeyPrincipal en lugar de id
        }
    });

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
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal { key: caller_principal }; // Crea un KeyPrincipal

    // Buscar si el usuario tiene una entrada en la libreta de direcciones
    ADDRESS_BOOK.with(|book| {
        let book = book.borrow();
        if let Some(user_address) = book.get(&key_principal) {
            // Si el usuario existe, devolver todas sus direcciones junto con su índice
            if let Some(user_addresses) = &user_address.addresses {
                return Ok(user_addresses.iter().enumerate().map(|(i, addr)| (i as u64, addr.clone())).collect());
            }
        }
        Err(ItemError::NotExist)
    })
}



#[ic_cdk::update]
fn update_address(new_address: UserAddressEdit) -> Result<(), ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal { key: caller_principal }; // Crea un KeyPrincipal

    ADDRESS_BOOK.with(|p| {
        let old_address_opt = p.borrow().get(&key_principal);
        let old_address: UserAddress;

        match old_address_opt {
            Some(value) => old_address = value,
            None => return Err(ItemError::NotExist),
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

        let result = p.borrow_mut().insert(key_principal, value); // Usa KeyPrincipal en lugar de id

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
fn check_if_address_exists(principal: Principal) -> bool {
    let key_principal = KeyPrincipal { key: principal }; // Crea un KeyPrincipal
    ADDRESS_BOOK.with(|p| p.borrow().contains_key(&key_principal)) // Usa KeyPrincipal en lugar de id
}

#[ic_cdk::query]
fn check_if_purchase_exists(id: u64) -> bool {
    PURCHASES.with(|p| p.borrow().contains_key(&id))
}

#[ic_cdk::query]
fn check_if_profile_exists(principal: Principal) -> bool {
    let key_principal = KeyPrincipal { key: principal }; // Crea un KeyPrincipal
    PROFILES.with(|p| p.borrow().contains_key(&key_principal)) // Usa KeyPrincipal en lugar de id
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
            reviews: old_item.reviews,
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
            Some(value) => old_item = value.clone(),
            None => return Err(ItemError::NotExist),
        }

        if let Some(owner) = old_item.owner {
            if owner != ic_cdk::api::caller() {
                return Err(ItemError::Unauthorized);
            }
        }

        // Verificar si existen compras pendientes para el artículo
        let mut has_pending_purchases = false;
        PURCHASES.with(|purchases| {
            let purchases = purchases.borrow();
            for purchase in purchases.iter().map(|(_, v)| v) {
                if purchase.item_id == id
                    && (purchase.status != PurchaseStatus::Completed
                        && purchase.status != PurchaseStatus::Refunded)
                {
                    has_pending_purchases = true;
                    break;
                }
            }
        });

        if has_pending_purchases {
            return Err(ItemError::ItemNotAllowed);
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

#[ic_cdk::query]
fn manager() -> Principal {
    ic_cdk::id()
}
