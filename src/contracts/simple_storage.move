/// Simple Storage module for storing and retrieving a single value
module simple_storage::simple_storage {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;

    /// Error codes
    const ENotAuthorized: u64 = 1;

    /// Simple storage object that holds a single value
    struct SimpleStorage has key {
        id: UID,
        value: u64,
        owner: address,
    }

    /// Event emitted when the value is updated
    struct ValueUpdated has copy, drop {
        storage_id: UID,
        old_value: u64,
        new_value: u64,
        updated_by: address,
        timestamp: u64,
    }

    /// Event emitted when storage is created
    struct StorageCreated has copy, drop {
        storage_id: UID,
        initial_value: u64,
        owner: address,
        timestamp: u64,
    }

    /// Create a new simple storage object
    public entry fun create_storage(initial_value: u64, ctx: &mut TxContext) {
        let owner = tx_context::sender(ctx);
        let storage_id = object::new(ctx);
        
        let storage = SimpleStorage {
            id: storage_id,
            value: initial_value,
            owner,
        };

        event::emit(StorageCreated {
            storage_id: object::uid_to_inner(&storage.id),
            initial_value,
            owner,
            timestamp: tx_context::epoch(ctx),
        });

        transfer::transfer(storage, owner);
    }

    /// Set a new value in the storage (only owner can update)
    public entry fun set_value(
        storage: &mut SimpleStorage,
        new_value: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == storage.owner, ENotAuthorized);
        
        let old_value = storage.value;
        storage.value = new_value;

        event::emit(ValueUpdated {
            storage_id: object::uid_to_inner(&storage.id),
            old_value,
            new_value,
            updated_by: sender,
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Get the current value from storage
    public fun get_value(storage: &SimpleStorage): u64 {
        storage.value
    }

    /// Get the owner of the storage
    public fun get_owner(storage: &SimpleStorage): address {
        storage.owner
    }

    /// Transfer ownership of the storage to a new owner
    public entry fun transfer_ownership(
        storage: &mut SimpleStorage,
        new_owner: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == storage.owner, ENotAuthorized);
        
        storage.owner = new_owner;
    }

    /// Get storage details (value and owner)
    public fun get_storage_details(storage: &SimpleStorage): (u64, address) {
        (storage.value, storage.owner)
    }
}
