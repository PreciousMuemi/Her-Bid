/// Consortium module for managing business consortiums and collaborative contracts
module consortium::consortium {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::table::{Self, Table};
    use std::string::{Self, String};
    use std::vector;

    /// Error codes
    const ENotMember: u64 = 1;
    const ENotOwner: u64 = 2;
    const EAlreadyMember: u64 = 3;
    const EConsortiumNotActive: u64 = 4;
    const EInsufficientFunds: u64 = 5;
    const EInvalidData: u64 = 6;
    const EProposalNotFound: u64 = 7;
    const EAlreadyVoted: u64 = 8;

    /// Consortium member structure
    struct Member has store {
        address: address,
        joined_at: u64,
        stake_amount: u64,
        voting_power: u64,
        is_active: bool,
    }

    /// Proposal structure for consortium governance
    struct Proposal has store {
        id: u64,
        title: String,
        description: String,
        proposed_by: address,
        created_at: u64,
        voting_deadline: u64,
        yes_votes: u64,
        no_votes: u64,
        executed: bool,
        voters: vector<address>,
    }

    /// Main consortium object
    struct Consortium has key {
        id: UID,
        name: String,
        description: String,
        owner: address,
        members: Table<address, Member>,
        treasury: Balance<SUI>,
        is_active: bool,
        member_count: u64,
        minimum_stake: u64,
        proposals: Table<u64, Proposal>,
        next_proposal_id: u64,
        created_at: u64,
    }

    /// Events
    struct ConsortiumCreated has copy, drop {
        consortium_id: UID,
        name: String,
        owner: address,
        timestamp: u64,
    }

    struct MemberJoined has copy, drop {
        consortium_id: UID,
        member: address,
        stake_amount: u64,
        timestamp: u64,
    }

    struct MemberLeft has copy, drop {
        consortium_id: UID,
        member: address,
        refund_amount: u64,
        timestamp: u64,
    }

    struct ProposalCreated has copy, drop {
        consortium_id: UID,
        proposal_id: u64,
        title: String,
        proposed_by: address,
        timestamp: u64,
    }

    struct VoteCast has copy, drop {
        consortium_id: UID,
        proposal_id: u64,
        voter: address,
        vote: bool,
        timestamp: u64,
    }

    struct ProposalExecuted has copy, drop {
        consortium_id: UID,
        proposal_id: u64,
        passed: bool,
        timestamp: u64,
    }

    /// Create a new consortium
    public entry fun create_consortium(
        name: vector<u8>,
        description: vector<u8>,
        minimum_stake: u64,
        initial_stake: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let owner = tx_context::sender(ctx);
        let consortium_id = object::new(ctx);
        
        // Validate input
        assert!(!vector::is_empty(&name), EInvalidData);
        assert!(minimum_stake > 0, EInvalidData);
        assert!(coin::value(&initial_stake) >= minimum_stake, EInsufficientFunds);

        let initial_balance = coin::into_balance(initial_stake);
        let stake_amount = balance::value(&initial_balance);

        let consortium = Consortium {
            id: consortium_id,
            name: string::utf8(name),
            description: string::utf8(description),
            owner,
            members: table::new(ctx),
            treasury: initial_balance,
            is_active: true,
            member_count: 1,
            minimum_stake,
            proposals: table::new(ctx),
            next_proposal_id: 0,
            created_at: tx_context::epoch(ctx),
        };

        // Add owner as first member
        let owner_member = Member {
            address: owner,
            joined_at: tx_context::epoch(ctx),
            stake_amount,
            voting_power: stake_amount,
            is_active: true,
        };

        table::add(&mut consortium.members, owner, owner_member);

        event::emit(ConsortiumCreated {
            consortium_id: object::uid_to_inner(&consortium.id),
            name: string::utf8(name),
            owner,
            timestamp: tx_context::epoch(ctx),
        });

        transfer::share_object(consortium);
    }

    /// Join an existing consortium
    public entry fun join_consortium(
        consortium: &mut Consortium,
        stake: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let member_address = tx_context::sender(ctx);
        
        // Check if consortium is active
        assert!(consortium.is_active, EConsortiumNotActive);
        
        // Check if already a member
        assert!(!table::contains(&consortium.members, member_address), EAlreadyMember);
        
        // Check minimum stake
        let stake_amount = coin::value(&stake);
        assert!(stake_amount >= consortium.minimum_stake, EInsufficientFunds);

        // Add stake to treasury
        let stake_balance = coin::into_balance(stake);
        balance::join(&mut consortium.treasury, stake_balance);

        // Create member record
        let member = Member {
            address: member_address,
            joined_at: tx_context::epoch(ctx),
            stake_amount,
            voting_power: stake_amount,
            is_active: true,
        };

        table::add(&mut consortium.members, member_address, member);
        consortium.member_count = consortium.member_count + 1;

        event::emit(MemberJoined {
            consortium_id: object::uid_to_inner(&consortium.id),
            member: member_address,
            stake_amount,
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Leave consortium and get stake refund
    public entry fun leave_consortium(
        consortium: &mut Consortium,
        ctx: &mut TxContext
    ) {
        let member_address = tx_context::sender(ctx);
        
        // Check if member exists
        assert!(table::contains(&consortium.members, member_address), ENotMember);
        
        // Owner cannot leave their own consortium
        assert!(member_address != consortium.owner, ENotOwner);

        let member = table::remove(&mut consortium.members, member_address);
        let refund_amount = member.stake_amount;

        // Refund stake from treasury
        let refund_balance = balance::split(&mut consortium.treasury, refund_amount);
        let refund_coin = coin::from_balance(refund_balance, ctx);
        
        transfer::public_transfer(refund_coin, member_address);
        consortium.member_count = consortium.member_count - 1;

        event::emit(MemberLeft {
            consortium_id: object::uid_to_inner(&consortium.id),
            member: member_address,
            refund_amount,
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Create a new proposal
    public entry fun create_proposal(
        consortium: &mut Consortium,
        title: vector<u8>,
        description: vector<u8>,
        voting_duration_epochs: u64,
        ctx: &mut TxContext
    ) {
        let proposer = tx_context::sender(ctx);
        
        // Check if proposer is a member
        assert!(table::contains(&consortium.members, proposer), ENotMember);
        assert!(consortium.is_active, EConsortiumNotActive);
        assert!(!vector::is_empty(&title), EInvalidData);

        let proposal_id = consortium.next_proposal_id;
        let current_epoch = tx_context::epoch(ctx);

        let proposal = Proposal {
            id: proposal_id,
            title: string::utf8(title),
            description: string::utf8(description),
            proposed_by: proposer,
            created_at: current_epoch,
            voting_deadline: current_epoch + voting_duration_epochs,
            yes_votes: 0,
            no_votes: 0,
            executed: false,
            voters: vector::empty(),
        };

        table::add(&mut consortium.proposals, proposal_id, proposal);
        consortium.next_proposal_id = proposal_id + 1;

        event::emit(ProposalCreated {
            consortium_id: object::uid_to_inner(&consortium.id),
            proposal_id,
            title: string::utf8(title),
            proposed_by: proposer,
            timestamp: current_epoch,
        });
    }

    /// Vote on a proposal
    public entry fun vote_on_proposal(
        consortium: &mut Consortium,
        proposal_id: u64,
        vote: bool,
        ctx: &mut TxContext
    ) {
        let voter = tx_context::sender(ctx);
        
        // Check if voter is a member
        assert!(table::contains(&consortium.members, voter), ENotMember);
        assert!(table::contains(&consortium.proposals, proposal_id), EProposalNotFound);

        let proposal = table::borrow_mut(&mut consortium.proposals, proposal_id);
        let member = table::borrow(&consortium.members, voter);

        // Check if voting is still open
        assert!(tx_context::epoch(ctx) <= proposal.voting_deadline, EInvalidData);
        assert!(!proposal.executed, EInvalidData);

        // Check if already voted
        assert!(!vector::contains(&proposal.voters, &voter), EAlreadyVoted);

        // Record vote
        vector::push_back(&mut proposal.voters, voter);
        
        if (vote) {
            proposal.yes_votes = proposal.yes_votes + member.voting_power;
        } else {
            proposal.no_votes = proposal.no_votes + member.voting_power;
        };

        event::emit(VoteCast {
            consortium_id: object::uid_to_inner(&consortium.id),
            proposal_id,
            voter,
            vote,
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Execute a proposal after voting period
    public entry fun execute_proposal(
        consortium: &mut Consortium,
        proposal_id: u64,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&consortium.proposals, proposal_id), EProposalNotFound);

        let proposal = table::borrow_mut(&mut consortium.proposals, proposal_id);
        
        // Check if voting period is over
        assert!(tx_context::epoch(ctx) > proposal.voting_deadline, EInvalidData);
        assert!(!proposal.executed, EInvalidData);

        proposal.executed = true;
        let passed = proposal.yes_votes > proposal.no_votes;

        event::emit(ProposalExecuted {
            consortium_id: object::uid_to_inner(&consortium.id),
            proposal_id,
            passed,
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Get consortium information
    public fun get_consortium_info(consortium: &Consortium): (String, String, address, u64, u64, bool) {
        (
            consortium.name,
            consortium.description,
            consortium.owner,
            consortium.member_count,
            balance::value(&consortium.treasury),
            consortium.is_active
        )
    }

    /// Check if address is a member
    public fun is_member(consortium: &Consortium, member_address: address): bool {
        table::contains(&consortium.members, member_address)
    }

    /// Get member information
    public fun get_member_info(consortium: &Consortium, member_address: address): (u64, u64, u64, bool) {
        assert!(table::contains(&consortium.members, member_address), ENotMember);
        
        let member = table::borrow(&consortium.members, member_address);
        (
            member.joined_at,
            member.stake_amount,
            member.voting_power,
            member.is_active
        )
    }

    /// Get proposal information
    public fun get_proposal_info(consortium: &Consortium, proposal_id: u64): (String, String, address, u64, u64, u64, u64, bool) {
        assert!(table::contains(&consortium.proposals, proposal_id), EProposalNotFound);
        
        let proposal = table::borrow(&consortium.proposals, proposal_id);
        (
            proposal.title,
            proposal.description,
            proposal.proposed_by,
            proposal.created_at,
            proposal.voting_deadline,
            proposal.yes_votes,
            proposal.no_votes,
            proposal.executed
        )
    }

    /// Get consortium treasury balance
    public fun get_treasury_balance(consortium: &Consortium): u64 {
        balance::value(&consortium.treasury)
    }

    /// Get minimum stake requirement
    public fun get_minimum_stake(consortium: &Consortium): u64 {
        consortium.minimum_stake
    }
}
