/// User Registry module for managing user profiles and verification
module user_registry::user_registry {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::{Self, String};
    use sui::table::{Self, Table};

    /// Error codes
    const EUserAlreadyExists: u64 = 1;
    const EUserDoesNotExist: u64 = 2;
    const ENotAuthorized: u64 = 3;
    const EInvalidData: u64 = 4;

    /// User profile structure
    struct UserProfile has store {
        business_name: String,
        email: String,
        industry: String,
        skills: String,
        is_verified: bool,
        registration_timestamp: u64,
    }

    /// Registry object containing all user profiles
    struct UserRegistry has key {
        id: UID,
        users: Table<address, UserProfile>,
        admin: address,
        total_users: u64,
    }

    /// Capability object for admin functions
    struct AdminCap has key, store {
        id: UID,
    }

    /// Event emitted when a user registers
    struct UserRegistered has copy, drop {
        user_address: address,
        business_name: String,
        timestamp: u64,
    }

    /// Event emitted when a user is verified
    struct UserVerified has copy, drop {
        user_address: address,
        verified_by: address,
        timestamp: u64,
    }

    /// Event emitted when a user profile is updated
    struct UserProfileUpdated has copy, drop {
        user_address: address,
        timestamp: u64,
    }

    /// Initialize the user registry (called once at deployment)
    fun init(ctx: &mut TxContext) {
        let admin = tx_context::sender(ctx);
        
        let registry = UserRegistry {
            id: object::new(ctx),
            users: table::new(ctx),
            admin,
            total_users: 0,
        };

        let admin_cap = AdminCap {
            id: object::new(ctx),
        };

        transfer::share_object(registry);
        transfer::transfer(admin_cap, admin);
    }

    /// Register a new user with their profile information
    public entry fun register_user(
        registry: &mut UserRegistry,
        business_name: vector<u8>,
        email: vector<u8>,
        industry: vector<u8>,
        skills: vector<u8>,
        ctx: &mut TxContext
    ) {
        let user_address = tx_context::sender(ctx);
        
        // Check if user already exists
        assert!(!table::contains(&registry.users, user_address), EUserAlreadyExists);
        
        // Validate input data
        assert!(!vector::is_empty(&business_name), EInvalidData);
        assert!(!vector::is_empty(&email), EInvalidData);

        let profile = UserProfile {
            business_name: string::utf8(business_name),
            email: string::utf8(email),
            industry: string::utf8(industry),
            skills: string::utf8(skills),
            is_verified: false,
            registration_timestamp: tx_context::epoch(ctx),
        };

        table::add(&mut registry.users, user_address, profile);
        registry.total_users = registry.total_users + 1;

        event::emit(UserRegistered {
            user_address,
            business_name: string::utf8(business_name),
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Update user profile information
    public entry fun update_profile(
        registry: &mut UserRegistry,
        business_name: vector<u8>,
        email: vector<u8>,
        industry: vector<u8>,
        skills: vector<u8>,
        ctx: &mut TxContext
    ) {
        let user_address = tx_context::sender(ctx);
        
        // Check if user exists
        assert!(table::contains(&registry.users, user_address), EUserDoesNotExist);
        
        // Validate input data
        assert!(!vector::is_empty(&business_name), EInvalidData);
        assert!(!vector::is_empty(&email), EInvalidData);

        let profile = table::borrow_mut(&mut registry.users, user_address);
        profile.business_name = string::utf8(business_name);
        profile.email = string::utf8(email);
        profile.industry = string::utf8(industry);
        profile.skills = string::utf8(skills);

        event::emit(UserProfileUpdated {
            user_address,
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Verify a user (admin only)
    public entry fun verify_user(
        registry: &mut UserRegistry,
        _admin_cap: &AdminCap,
        user_address: address,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&registry.users, user_address), EUserDoesNotExist);
        
        let profile = table::borrow_mut(&mut registry.users, user_address);
        profile.is_verified = true;

        event::emit(UserVerified {
            user_address,
            verified_by: tx_context::sender(ctx),
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Check if a user exists
    public fun user_exists(registry: &UserRegistry, user_address: address): bool {
        table::contains(&registry.users, user_address)
    }

    /// Check if a user is verified
    public fun is_user_verified(registry: &UserRegistry, user_address: address): bool {
        if (!table::contains(&registry.users, user_address)) {
            return false
        };
        
        let profile = table::borrow(&registry.users, user_address);
        profile.is_verified
    }

    /// Get user profile information
    public fun get_user_profile(registry: &UserRegistry, user_address: address): (String, String, String, String, bool) {
        assert!(table::contains(&registry.users, user_address), EUserDoesNotExist);
        
        let profile = table::borrow(&registry.users, user_address);
        (
            profile.business_name,
            profile.email,
            profile.industry,
            profile.skills,
            profile.is_verified
        )
    }

    /// Get user business name
    public fun get_business_name(registry: &UserRegistry, user_address: address): String {
        assert!(table::contains(&registry.users, user_address), EUserDoesNotExist);
        
        let profile = table::borrow(&registry.users, user_address);
        profile.business_name
    }

    /// Get user email
    public fun get_email(registry: &UserRegistry, user_address: address): String {
        assert!(table::contains(&registry.users, user_address), EUserDoesNotExist);
        
        let profile = table::borrow(&registry.users, user_address);
        profile.email
    }

    /// Get total number of registered users
    public fun get_total_users(registry: &UserRegistry): u64 {
        registry.total_users
    }

    /// Get registry admin address
    public fun get_admin(registry: &UserRegistry): address {
        registry.admin
    }

    /// Get user registration timestamp
    public fun get_registration_timestamp(registry: &UserRegistry, user_address: address): u64 {
        assert!(table::contains(&registry.users, user_address), EUserDoesNotExist);
        
        let profile = table::borrow(&registry.users, user_address);
        profile.registration_timestamp
    }
}
