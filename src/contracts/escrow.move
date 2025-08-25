/// Escrow module for managing secure payments between parties
module escrow::escrow {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::vector;

    /// Error codes
    const ENotAuthorized: u64 = 1;
    const EInvalidAmount: u64 = 2;
    const EAlreadyReleased: u64 = 3;
    const EInsufficientFunds: u64 = 4;

    /// Escrow object containing the locked funds and metadata
    struct Escrow has key, store {
        id: UID,
        sender: address,
        receivers: vector<address>,
        locked_funds: Coin<SUI>,
        amount: u64,
        is_released: bool,
        milestone_id: u64,
    }

    /// Event emitted when an escrow is created
    struct EscrowCreated has copy, drop {
        escrow_id: address,
        sender: address,
        receivers: vector<address>,
        amount: u64,
        milestone_id: u64,
    }

    /// Event emitted when funds are deposited into escrow
    struct FundsDeposited has copy, drop {
        escrow_id: address,
        depositor: address,
        amount: u64,
    }

    /// Event emitted when funds are released from escrow
    struct FundsReleased has copy, drop {
        escrow_id: address,
        sender: address,
        receivers: vector<address>,
        amount: u64,
    }

    /// Create a new escrow with the specified receivers and initial funding
    public entry fun create_escrow(
        receivers: vector<address>,
        payment: Coin<SUI>,
        milestone_id: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let amount = coin::value(&payment);
        
        assert!(amount > 0, EInvalidAmount);
        assert!(vector::length(&receivers) > 0, EInvalidAmount);

        let escrow = Escrow {
            id: object::new(ctx),
            sender,
            receivers,
            locked_funds: payment,
            amount,
            is_released: false,
            milestone_id,
        };

        let escrow_address = object::uid_to_address(&escrow.id);

        event::emit(EscrowCreated {
            escrow_id: escrow_address,
            sender,
            receivers,
            amount,
            milestone_id,
        });

        transfer::share_object(escrow);
    }

    /// Deposit additional funds into an existing escrow
    public entry fun deposit_funds(
        escrow: &mut Escrow,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(!escrow.is_released, EAlreadyReleased);
        
        let deposit_amount = coin::value(&payment);
        assert!(deposit_amount > 0, EInvalidAmount);

        coin::join(&mut escrow.locked_funds, payment);
        escrow.amount = escrow.amount + deposit_amount;

        event::emit(FundsDeposited {
            escrow_id: object::uid_to_address(&escrow.id),
            depositor: tx_context::sender(ctx),
            amount: deposit_amount,
        });
    }

    /// Release funds from escrow to the receivers
    /// Only the original sender can release the funds
    public entry fun release_funds(
        escrow: &mut Escrow,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == escrow.sender, ENotAuthorized);
        assert!(!escrow.is_released, EAlreadyReleased);
        assert!(coin::value(&escrow.locked_funds) > 0, EInsufficientFunds);

        escrow.is_released = true;
        
        let total_amount = coin::value(&escrow.locked_funds);
        let num_receivers = vector::length(&escrow.receivers);
        let amount_per_receiver = total_amount / num_receivers;
        
        let i = 0;
        while (i < num_receivers - 1) {
            let receiver = *vector::borrow(&escrow.receivers, i);
            let payment = coin::split(&mut escrow.locked_funds, amount_per_receiver, ctx);
            transfer::public_transfer(payment, receiver);
            i = i + 1;
        };

        // Send remaining funds to the last receiver (handles any rounding)
        let last_receiver = *vector::borrow(&escrow.receivers, num_receivers - 1);
        let remaining_funds = coin::split(&mut escrow.locked_funds, coin::value(&escrow.locked_funds), ctx);
        transfer::public_transfer(remaining_funds, last_receiver);

        event::emit(FundsReleased {
            escrow_id: object::uid_to_address(&escrow.id),
            sender: escrow.sender,
            receivers: escrow.receivers,
            amount: total_amount,
        });
    }

    /// Cancel escrow and return funds to sender
    /// Only the original sender can cancel
    public entry fun cancel_escrow(
        escrow: &mut Escrow,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == escrow.sender, ENotAuthorized);
        assert!(!escrow.is_released, EAlreadyReleased);

        escrow.is_released = true;
        
        let refund = coin::split(&mut escrow.locked_funds, coin::value(&escrow.locked_funds), ctx);
        transfer::public_transfer(refund, escrow.sender);
    }

    /// Get escrow details (view function)
    public fun get_escrow_info(escrow: &Escrow): (address, vector<address>, u64, bool, u64) {
        (
            escrow.sender,
            escrow.receivers,
            escrow.amount,
            escrow.is_released,
            escrow.milestone_id
        )
    }

    /// Check if escrow is released
    public fun is_released(escrow: &Escrow): bool {
        escrow.is_released
    }

    /// Get escrow balance
    public fun get_balance(escrow: &Escrow): u64 {
        coin::value(&escrow.locked_funds)
    }

    /// Get escrow sender
    public fun get_sender(escrow: &Escrow): address {
        escrow.sender
    }

    /// Get escrow receivers
    public fun get_receivers(escrow: &Escrow): vector<address> {
        escrow.receivers
    }

    /// Get milestone ID
    public fun get_milestone_id(escrow: &Escrow): u64 {
        escrow.milestone_id
    }
}
