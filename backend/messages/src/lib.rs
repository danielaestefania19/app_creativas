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



#[derive(CandidType, Deserialize, Clone)]
pub struct ResultSearch {
    matches: bool,
    users: Vec<(String, Principal)>,
}



type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_VALUE_SIZE_MESSAGE: u32 = 8000;
const MAX_VALUE_SIZE_PROFILE: u32 = 5000;
const MAX_VALUE_SIZE_PRINCIPAL: u32 = 200;
const MAX_VALUE_SIZE_USER_MESSAGES: u32 = 8000;
const MAX_VALUE_SIZE_FCM_TOKENS: u32 = 8000;
const MAX_VALUE_SIZE_PRINCIPAL_INDEX: u32 = 200;


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
    OutOfStock,
}





#[derive(CandidType, Deserialize, Clone)]
pub struct Profile {
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
    unread: u64,       // Cambia a u64
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

#[derive(CandidType, Deserialize, Clone, PartialEq, PartialOrd, Eq, Ord)]
pub struct IndexUserName {
    field: Vec<String>,
}
impl Storable for IndexUserName {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_PRINCIPAL_INDEX,
        is_fixed_size: false,
    };
}

#[derive(Eq, PartialEq, CandidType, Deserialize, Clone, PartialOrd, Ord)]
struct UsernameKey {
    username: String,
    key_principal: KeyPrincipal,
}

impl Storable for UsernameKey {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE_PRINCIPAL_INDEX,
        is_fixed_size: false,
    };
}
#[derive(CandidType, Deserialize, Clone)]
pub struct InboxResult {
    conversations: Vec<Conversation>,
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






thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
    RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

  // Cambia el tipo de clave de u64 a Principal
  static PROFILES: RefCell<StableBTreeMap<KeyPrincipal, Profile, Memory>> = RefCell::new(StableBTreeMap::init(
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
));
    static LAST_SEEN: RefCell<StableBTreeMap<KeyPrincipal, u64, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
    ));

    static USER_MESSAGES: RefCell<StableBTreeMap<KeyPrincipal, UserMessages, Memory>> = RefCell::new(StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
    ));

        // Cambia el tipo de clave de u64 a Principal
static FCM_TOKENS: RefCell<StableBTreeMap<KeyPrincipal, FcmTokens, Memory>> = RefCell::new(StableBTreeMap::init(
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
));

static PREFIX_INDEX: RefCell<StableBTreeMap<String, IndexUserName, Memory>> = RefCell::new(StableBTreeMap::init(
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(4))),
));

static USERNAME_TO_KEY: RefCell<StableBTreeMap<UsernameKey, KeyPrincipal, Memory>> = RefCell::new(StableBTreeMap::init(
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(5))),
));


}



fn get_prefixes(s: &str, min_length: u64) -> Vec<String> {
    let mut prefixes = Vec::new();
    for i in (min_length as usize)..=s.len() {
        prefixes.push(s[..i].to_string());
    }
    prefixes
}


#[ic_cdk::init]
fn create_profile_canister(profile: CreateProfile) {
    let caller_principal = ic_cdk::id();
    let key_principal = KeyPrincipal {
        key: caller_principal,
    }; // Crea un KeyPrincipal

    let value: Profile = Profile {
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
        let mut user_messages = um
            .get(&KeyPrincipal {
                key: message.addressee.clone(),
            })
            .clone()
            .unwrap_or(UserMessages {
                messages: vec![],
                last_checked: 0,
                unread: 0,
            });
        user_messages.messages.push(new_message.clone());
        um.insert(
            KeyPrincipal {
                key: message.addressee.clone(),
            },
            user_messages,
        );
    });

    // Añade el nuevo mensaje a los mensajes del usuario que envía
    USER_MESSAGES.with(|um| {
        let mut um = um.borrow_mut();
        let mut user_messages =
            um.get(&KeyPrincipal { key: sender })
                .clone()
                .unwrap_or(UserMessages {
                    messages: vec![],
                    last_checked: 0,
                    unread: 0,
                });
        user_messages.messages.push(new_message);
        um.insert(KeyPrincipal { key: sender }, user_messages);
    });

    // Inicializa last_seen a 0 para el receptor del mensaje
    LAST_SEEN.with(|ls| {
        let mut ls = ls.borrow_mut();
        ls.insert(
            KeyPrincipal {
                key: message.addressee.clone(),
            },
            0,
        );
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
        let mut user_messages = um
            .get(&KeyPrincipal {
                key: message.addressee.clone(),
            })
            .clone()
            .unwrap_or(UserMessages {
                messages: vec![],
                last_checked: 0,
                unread: 0,
            });
        user_messages.messages.push(new_message.clone());
        um.insert(
            KeyPrincipal {
                key: message.addressee.clone(),
            },
            user_messages,
        );
    });

    // Añade el nuevo mensaje a los mensajes del canister
    USER_MESSAGES.with(|um| {
        let mut um = um.borrow_mut();
        let mut user_messages =
            um.get(&KeyPrincipal { key: sender })
                .clone()
                .unwrap_or(UserMessages {
                    messages: vec![],
                    last_checked: 0,
                    unread: 0,
                });
        user_messages.messages.push(new_message);
        um.insert(KeyPrincipal { key: sender }, user_messages);
    });

    // Inicializa last_seen a 0 para el receptor del mensaje
    LAST_SEEN.with(|ls| {
        let mut ls = ls.borrow_mut();
        ls.insert(
            KeyPrincipal {
                key: message.addressee.clone(),
            },
            0,
        );
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
                return Ok(());
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
fn get_tokens_for_principal(principal_str: String) -> Result<Vec<String>, ItemError> {
    // Parsea el Principal desde la cadena de texto
    let principal = Principal::from_text(&principal_str).map_err(|_| ItemError::NotExist)?;

    let key = KeyPrincipal { key: principal };

    // Obtiene los tokens para el Principal
    FCM_TOKENS.with(|fcm_tokens_map| {
        let fcm_tokens_map = fcm_tokens_map.borrow();

        if let Some(fcm_tokens) = fcm_tokens_map.get(&key) {
            // Si el Principal existe en el mapa, retorna los tokens.
            Ok(fcm_tokens.tokens.clone())
        } else {
            // Si el Principal no existe en el mapa, retorna un error.
            Err(ItemError::NotExist)
        }
    })
}

#[ic_cdk::query]
fn get_inbox() -> Result<InboxResult, ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let mut conversations: HashMap<Principal, (Message, u64, bool)> = HashMap::new();

    let user_messages = USER_MESSAGES.with(|um| {
        let um = um.borrow();
        um.get(&KeyPrincipal {
            key: caller_principal,
        })
        .clone()
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
                conversations.insert(other_user, (message.clone(), new_unread_count, new_unread));
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
            conversations.insert(other_user, (message.clone(), new_unread_count, new_unread));
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
        um.insert(
            KeyPrincipal {
                key: caller_principal,
            },
            user_messages,
        );
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
    Ok(InboxResult { conversations })
}

#[ic_cdk::query]
fn get_private_chat(other_user: Principal) -> Result<Vec<Message>, ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let mut messages = Vec::new();

    // Recoge todos los mensajes entre el usuario actual y other_user
    USER_MESSAGES.with(|um| {
        let um = um.borrow();

        if let Some(user_messages) = um.get(&KeyPrincipal {
            key: caller_principal,
        }) {
            for message in &user_messages.messages {
                if (message.addressee == Some(caller_principal)
                    && message.sender == Some(other_user.clone()))
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

        if let Some(mut user_messages) = um
            .get(&KeyPrincipal {
                key: caller_principal,
            })
            .clone()
        {
            // Obtiene el último mensaje visto en esta conversación
            let last_seen = LAST_SEEN.with(|ls| {
                let ls = ls.borrow();
                ls.get(&KeyPrincipal {
                    key: other_user.clone(),
                })
                .unwrap_or(0)
                .clone()
            });

            for (i, message) in user_messages.messages.iter_mut().enumerate() {
                if i < last_seen as usize {
                    continue; // Salta los mensajes ya vistos
                }

                if (message.addressee == Some(caller_principal)
                    && message.sender == Some(other_user.clone()))
                    || (message.addressee == Some(other_user.clone())
                        && message.sender == Some(caller_principal))
                        && message.status != MensajeStatus::Read
                {
                    message.status = MensajeStatus::Read;
                    LAST_SEEN.with(|ls| {
                        let mut ls = ls.borrow_mut();
                        ls.insert(
                            KeyPrincipal {
                                key: other_user.clone(),
                            },
                            i as u64,
                        ); // Actualiza el último mensaje visto
                    });
                }
            }

            // Vuelve a insertar el UserMessages actualizado en el mapa
            um.insert(
                KeyPrincipal {
                    key: caller_principal,
                },
                user_messages.clone(),
            );

            // Actualiza los mensajes en la lista de mensajes del otro usuario
            if let Some(mut other_user_messages) = um
                .get(&KeyPrincipal {
                    key: other_user.clone(),
                })
                .clone()
            {
                for message in other_user_messages.messages.iter_mut() {
                    if (message.addressee == Some(other_user.clone())
                        && message.sender == Some(caller_principal))
                        || (message.addressee == Some(caller_principal)
                            && message.sender == Some(other_user.clone()))
                            && message.status != MensajeStatus::Read
                    {
                        message.status = MensajeStatus::Read;
                    }
                }

                // Vuelve a insertar el UserMessages actualizado en el mapa
                um.insert(
                    KeyPrincipal {
                        key: other_user.clone(),
                    },
                    other_user_messages,
                );
            }
        }
    });

    Ok(())
}



#[ic_cdk::query]
fn has_profile() -> bool {
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal {
        key: caller_principal,
    }; // Crea un KeyPrincipal
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
        username: profile.username.clone(),
        profile_picture: profile.profile_picture,
        about: profile.about,
        active: false,
        last_connection: None,
    };

    let key_principal = KeyPrincipal {
        key: caller_principal.clone(),
    }; // Crea un KeyPrincipal
       // Usa KeyPrincipal en lugar de Principal
    PROFILES.with(|p| p.borrow_mut().insert(key_principal.clone(), value));

    // Actualiza PREFIX_INDEX y USERNAME_TO_KEY
    let username_prefixes = get_prefixes(&profile.username, 3); // Asume un min_length de 3
    for prefix in username_prefixes {
        PREFIX_INDEX.with(|p| {
            let mut index = p.borrow_mut();
            if let Some(_) = index.get(&prefix) {
                let mut new_entry = index.remove(&prefix).unwrap();
                new_entry.field.push(profile.username.clone());
                index.insert(prefix, new_entry);
            } else {
                index.insert(
                    prefix,
                    IndexUserName {
                        field: vec![profile.username.clone()],
                    },
                );
            }
        });
    }
    USERNAME_TO_KEY.with(|u| {
        u.borrow_mut().insert(
            UsernameKey {
                username: profile.username.clone(),
                key_principal: key_principal.clone(),
            },
            key_principal,
        );
    });

    Ok(())
}

#[ic_cdk::query]
fn autocomplete_search(prefix: String) -> ResultSearch {
    let prefix = prefix.to_lowercase();
    let prefix: String = prefix.nfkd().collect();

    let mut usernames = HashSet::new();

    PREFIX_INDEX.with(|p| {
        let index = p.borrow();
        for (key, entry) in index.iter() {
            let distance = levenshtein(&prefix, &key);

            if distance <= 3 {
                for username in &entry.field {
                    USERNAME_TO_KEY.with(|u| {
                        let map = u.borrow();
                        for (username_key, key_principal) in map.iter() {
                            if username_key.username == *username {
                                usernames.insert((username.clone(), key_principal.key.clone()));
                            }
                        }
                    });
                }
            }
        }
    });

    let matches = !usernames.is_empty();

    if usernames.is_empty() {
        let all_usernames: Vec<(String, Principal)> = USERNAME_TO_KEY.with(|u| {
            u.borrow()
                .iter()
                .map(|(username_key, key_principal)| {
                    (username_key.username.clone(), key_principal.key.clone())
                })
                .collect()
        });

        let mut hasher = DefaultHasher::new();
        prefix.hash(&mut hasher);
        let hash = hasher.finish();

        let start_index = if !all_usernames.is_empty() {
            let len = all_usernames.len();
            if len > 1 {
                (hash as usize) % len
            } else {
                0
            }
        } else {
            0
        };

        let end_index = start_index + 5;
        if !all_usernames.is_empty() {
            for i in start_index..end_index {
                let index = i % all_usernames.len();
                // Comprueba si el Principal ya está en el HashSet antes de insertarlo
                if !usernames.contains(&all_usernames[index]) {
                    usernames.insert(all_usernames[index].clone());
                }
            }
        }
    }

    let mut usernames: Vec<_> = usernames.into_iter().collect();

    usernames.sort_by(|(a, _), (b, _)| {
        let a_starts_with_prefix = a.to_lowercase().starts_with(&prefix);
        let b_starts_with_prefix = b.to_lowercase().starts_with(&prefix);
        match (a_starts_with_prefix, b_starts_with_prefix) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.cmp(b),
        }
    });

    ResultSearch {
        matches: matches,
        users: usernames,
    }
}

#[ic_cdk::query]
fn get_profile_key_by_principal(principal: Principal) -> Result<Profile, ItemError> {
    let key_principal = KeyPrincipal { key: principal }; // Crea un KeyPrincipal

    PROFILES.with(|profiles| {
        // Intenta obtener el perfil directamente usando el KeyPrincipal
        match profiles.borrow().get(&key_principal) {
            Some(profile) => Ok(profile.clone()), // Si el perfil existe, devolverlo
            None => Err(ItemError::NotExist),     // Si no se encontró un perfil, devolver un error
        }
    })
}

#[ic_cdk::query]
fn get_user_profile() -> Result<Profile, ItemError> {
    let principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal { key: principal }; // Crea un KeyPrincipal

    PROFILES.with(|profiles| {
        // Intenta obtener el perfil directamente usando el KeyPrincipal
        match profiles.borrow().get(&key_principal) {
            Some(profile) => Ok(profile.clone()), // Si el perfil existe, devolverlo
            None => Err(ItemError::NotExist),     // Si no se encontró un perfil, devolver un error
        }
    })
}

#[ic_cdk::update]
fn activate_profile() -> Result<(), ItemError> {
    let caller_principal = ic_cdk::api::caller();
    let key_principal = KeyPrincipal {
        key: caller_principal,
    }; // Crea un KeyPrincipal

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
    let key_principal = KeyPrincipal {
        key: caller_principal,
    }; // Crea un KeyPrincipal

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
    let profile = get_profile_key_by_principal(principal)?;
    Ok(profile.active)
}


#[ic_cdk::query]
fn check_if_profile_exists(principal: Principal) -> bool {
    let key_principal = KeyPrincipal { key: principal }; // Crea un KeyPrincipal
    PROFILES.with(|p| p.borrow().contains_key(&key_principal)) // Usa KeyPrincipal en lugar de id
}


#[ic_cdk::query]
fn whoami() -> Principal {
    ic_cdk::api::caller()
}

#[ic_cdk::query]
fn manager() -> Principal {
    ic_cdk::id()
}
