"""
GigeBid Hybrid Payment System
Handles seamless conversion between M-Pesa (KES) and Sui blockchain (USDC)
All user interactions happen in KES while smart contracts operate in USDC
"""

import json
import time
import hashlib
import requests
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
from decimal import Decimal, ROUND_HALF_UP
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PaymentTransaction:
    """Payment transaction record"""
    transaction_id: str
    user_id: str
    amount_kes: Decimal
    amount_usdc: Decimal
    exchange_rate: Decimal
    transaction_type: str  # 'deposit', 'withdrawal', 'escrow_payment'
    status: str  # 'pending', 'completed', 'failed'
    mpesa_transaction_id: Optional[str] = None
    sui_transaction_id: Optional[str] = None
    created_at: str = ""
    completed_at: Optional[str] = None

@dataclass
class EscrowPayment:
    """Escrow payment details"""
    escrow_id: str
    project_id: str
    total_amount_kes: Decimal
    total_amount_usdc: Decimal
    milestones: List[Dict[str, Any]]
    participants: List[str]
    created_at: str
    status: str = "active"

class MPesaConnector:
    """M-Pesa API integration for KES transactions"""
    
    def __init__(self, environment: str = "sandbox"):
        self.environment = environment
        self.base_url = "https://sandbox.safaricom.co.ke" if environment == "sandbox" else "https://api.safaricom.co.ke"
        self.consumer_key = "your_consumer_key"  # From environment variables
        self.consumer_secret = "your_consumer_secret"
        self.access_token = None
        self.token_expires_at = 0
        
    async def get_access_token(self) -> str:
        """Get OAuth access token for M-Pesa API"""
        if self.access_token and time.time() < self.token_expires_at:
            return self.access_token
            
        try:
            # In production, load from environment variables
            auth_url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
            
            # Mock response for development
            self.access_token = "mock_access_token_" + str(int(time.time()))
            self.token_expires_at = time.time() + 3600  # 1 hour
            
            logger.info("M-Pesa access token refreshed")
            return self.access_token
            
        except Exception as e:
            logger.error(f"Failed to get M-Pesa access token: {e}")
            raise
    
    async def initiate_stk_push(self, phone_number: str, amount: Decimal, reference: str) -> Dict[str, Any]:
        """Initiate STK Push for payment collection"""
        try:
            await self.get_access_token()
            
            # Mock STK Push response for development
            transaction_id = f"stk_{int(time.time())}_{hash(phone_number) % 10000}"
            
            # In production, this would make actual API call to M-Pesa
            response = {
                "MerchantRequestID": f"merchant_{int(time.time())}",
                "CheckoutRequestID": transaction_id,
                "ResponseCode": "0",
                "ResponseDescription": "Success. Request accepted for processing",
                "CustomerMessage": f"Success. Request accepted for processing. Please complete payment on your phone."
            }
            
            logger.info(f"STK Push initiated: {transaction_id} for KES {amount}")
            return response
            
        except Exception as e:
            logger.error(f"STK Push failed: {e}")
            raise
    
    async def check_transaction_status(self, checkout_request_id: str) -> Dict[str, Any]:
        """Check M-Pesa transaction status"""
        try:
            # Mock transaction status check
            # In production, this would query M-Pesa API
            status_response = {
                "ResponseCode": "0",
                "ResponseDescription": "The service request has been accepted successfully",
                "MerchantRequestID": f"merchant_{int(time.time())}",
                "CheckoutRequestID": checkout_request_id,
                "ResultCode": "0",
                "ResultDesc": "The service request is processed successfully.",
                "Amount": "1000.00",
                "MpesaReceiptNumber": f"OGI{int(time.time())}{hash(checkout_request_id) % 1000}",
                "TransactionDate": int(time.time()),
                "PhoneNumber": "254708374149"
            }
            
            return status_response
            
        except Exception as e:
            logger.error(f"Transaction status check failed: {e}")
            raise

class ExchangeRateService:
    """Service for KES to USDC exchange rate management"""
    
    def __init__(self):
        self.cache_duration = 300  # 5 minutes cache
        self.cached_rate = None
        self.cache_timestamp = 0
        
    async def get_kes_to_usdc_rate(self) -> Decimal:
        """Get current KES to USDC exchange rate"""
        current_time = time.time()
        
        if (self.cached_rate and 
            current_time - self.cache_timestamp < self.cache_duration):
            return self.cached_rate
        
        try:
            # In production, fetch from multiple exchange APIs
            # For development, using mock rate
            usd_to_kes = Decimal("143.50")  # Approximate rate
            usdc_to_usd = Decimal("1.00")   # USDC is pegged to USD
            
            kes_to_usdc = (usdc_to_usd / usd_to_kes).quantize(
                Decimal('0.000001'), rounding=ROUND_HALF_UP
            )
            
            self.cached_rate = kes_to_usdc
            self.cache_timestamp = current_time
            
            logger.info(f"Exchange rate updated: 1 KES = {kes_to_usdc} USDC")
            return kes_to_usdc
            
        except Exception as e:
            logger.error(f"Failed to get exchange rate: {e}")
            # Fallback rate
            return Decimal("0.007")  # Approximate fallback
    
    def kes_to_usdc(self, kes_amount: Decimal) -> Decimal:
        """Convert KES amount to USDC"""
        rate = self.get_kes_to_usdc_rate()
        usdc_amount = (kes_amount * rate).quantize(
            Decimal('0.000001'), rounding=ROUND_HALF_UP
        )
        return usdc_amount
    
    def usdc_to_kes(self, usdc_amount: Decimal) -> Decimal:
        """Convert USDC amount to KES"""
        rate = self.get_kes_to_usdc_rate()
        kes_amount = (usdc_amount / rate).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )
        return kes_amount

class HybridPaymentSystem:
    """
    Main payment system that orchestrates M-Pesa and Sui blockchain operations
    Users interact only in KES, while smart contracts operate in USDC
    """
    
    def __init__(self, sui_connector=None):
        self.mpesa = MPesaConnector()
        self.exchange_service = ExchangeRateService()
        self.sui_connector = sui_connector
        self.transaction_history: Dict[str, PaymentTransaction] = {}
        self.escrow_contracts: Dict[str, EscrowPayment] = {}
        
    async def initiate_deposit(self, user_id: str, phone_number: str, 
                             amount_kes: Decimal, project_reference: str) -> PaymentTransaction:
        """
        Initiate deposit from M-Pesa to platform
        1. User pays in KES via M-Pesa
        2. System converts to USDC at current rate
        3. USDC is deposited to user's Sui wallet
        """
        try:
            # Generate transaction ID
            transaction_id = f"dep_{int(time.time())}_{hash(user_id) % 10000}"
            
            # Get exchange rate
            exchange_rate = await self.exchange_service.get_kes_to_usdc_rate()
            amount_usdc = self.exchange_service.kes_to_usdc(amount_kes)
            
            # Create transaction record
            transaction = PaymentTransaction(
                transaction_id=transaction_id,
                user_id=user_id,
                amount_kes=amount_kes,
                amount_usdc=amount_usdc,
                exchange_rate=exchange_rate,
                transaction_type="deposit",
                status="pending",
                created_at=time.strftime("%Y-%m-%d %H:%M:%S")
            )
            
            # Initiate M-Pesa STK Push
            stk_response = await self.mpesa.initiate_stk_push(
                phone_number, amount_kes, project_reference
            )
            
            transaction.mpesa_transaction_id = stk_response["CheckoutRequestID"]
            self.transaction_history[transaction_id] = transaction
            
            logger.info(f"Deposit initiated: {transaction_id} - KES {amount_kes} -> USDC {amount_usdc}")
            return transaction
            
        except Exception as e:
            logger.error(f"Deposit initiation failed: {e}")
            raise
    
    async def process_deposit_completion(self, transaction_id: str) -> bool:
        """
        Process completed M-Pesa payment and mint USDC to Sui wallet
        """
        try:
            transaction = self.transaction_history.get(transaction_id)
            if not transaction:
                raise ValueError(f"Transaction not found: {transaction_id}")
            
            # Check M-Pesa transaction status
            mpesa_status = await self.mpesa.check_transaction_status(
                transaction.mpesa_transaction_id
            )
            
            if mpesa_status["ResultCode"] == "0":  # Success
                # Process Sui blockchain deposit
                if self.sui_connector:
                    # In production, mint USDC to user's Sui wallet
                    sui_tx_id = f"sui_mint_{int(time.time())}"
                    transaction.sui_transaction_id = sui_tx_id
                
                transaction.status = "completed"
                transaction.completed_at = time.strftime("%Y-%m-%d %H:%M:%S")
                
                logger.info(f"Deposit completed: {transaction_id}")
                return True
            else:
                transaction.status = "failed"
                logger.warning(f"M-Pesa payment failed: {mpesa_status}")
                return False
                
        except Exception as e:
            logger.error(f"Deposit processing failed: {e}")
            raise
    
    async def create_project_escrow(self, project_id: str, client_user_id: str,
                                  total_amount_kes: Decimal, milestones: List[Dict],
                                  participants: List[str]) -> EscrowPayment:
        """
        Create escrow contract for project payments
        1. Client deposits total amount in KES
        2. Converted to USDC and locked in Sui smart contract
        3. Released based on milestone completion
        """
        try:
            escrow_id = f"escrow_{project_id}_{int(time.time())}"
            
            # Convert to USDC
            exchange_rate = await self.exchange_service.get_kes_to_usdc_rate()
            total_amount_usdc = self.exchange_service.kes_to_usdc(total_amount_kes)
            
            # Process initial deposit from client
            deposit_transaction = await self.initiate_deposit(
                client_user_id, 
                "+254700000000",  # Would come from user profile
                total_amount_kes,
                f"Project {project_id} Escrow"
            )
            
            # Create escrow contract on Sui
            if self.sui_connector:
                escrow_contract_id = await self.sui_connector.create_escrow_contract(
                    escrow_id, total_amount_usdc, milestones, participants
                )
            
            # Create escrow record
            escrow = EscrowPayment(
                escrow_id=escrow_id,
                project_id=project_id,
                total_amount_kes=total_amount_kes,
                total_amount_usdc=total_amount_usdc,
                milestones=milestones,
                participants=participants,
                created_at=time.strftime("%Y-%m-%d %H:%M:%S")
            )
            
            self.escrow_contracts[escrow_id] = escrow
            
            logger.info(f"Project escrow created: {escrow_id} - KES {total_amount_kes}")
            return escrow
            
        except Exception as e:
            logger.error(f"Escrow creation failed: {e}")
            raise
    
    async def release_milestone_payment(self, escrow_id: str, milestone_index: int,
                                      recipient_user_id: str) -> PaymentTransaction:
        """
        Release milestone payment to team member
        1. Release USDC from Sui smart contract
        2. Convert USDC to KES at current rate
        3. Send KES to recipient's M-Pesa
        """
        try:
            escrow = self.escrow_contracts.get(escrow_id)
            if not escrow:
                raise ValueError(f"Escrow not found: {escrow_id}")
            
            milestone = escrow.milestones[milestone_index]
            milestone_amount_usdc = Decimal(str(milestone["amount_usdc"]))
            
            # Convert USDC to KES at current rate
            milestone_amount_kes = self.exchange_service.usdc_to_kes(milestone_amount_usdc)
            
            # Release from Sui smart contract
            if self.sui_connector:
                sui_release_tx = await self.sui_connector.release_milestone_payment(
                    escrow_id, milestone_index, recipient_user_id
                )
            
            # Create withdrawal transaction
            transaction_id = f"withdrawal_{int(time.time())}_{hash(recipient_user_id) % 10000}"
            
            transaction = PaymentTransaction(
                transaction_id=transaction_id,
                user_id=recipient_user_id,
                amount_kes=milestone_amount_kes,
                amount_usdc=milestone_amount_usdc,
                exchange_rate=await self.exchange_service.get_kes_to_usdc_rate(),
                transaction_type="milestone_payment",
                status="completed",
                sui_transaction_id=sui_release_tx if self.sui_connector else f"mock_sui_{int(time.time())}",
                created_at=time.strftime("%Y-%m-%d %H:%M:%S"),
                completed_at=time.strftime("%Y-%m-%d %H:%M:%S")
            )
            
            self.transaction_history[transaction_id] = transaction
            
            # In production, trigger M-Pesa B2C payment to recipient
            logger.info(f"Milestone payment released: {transaction_id} - USDC {milestone_amount_usdc} -> KES {milestone_amount_kes}")
            
            return transaction
            
        except Exception as e:
            logger.error(f"Milestone payment release failed: {e}")
            raise
    
    def get_transaction_history(self, user_id: str) -> List[PaymentTransaction]:
        """Get transaction history for a user"""
        return [
            tx for tx in self.transaction_history.values() 
            if tx.user_id == user_id
        ]
    
    def get_escrow_details(self, escrow_id: str) -> Optional[EscrowPayment]:
        """Get escrow contract details"""
        return self.escrow_contracts.get(escrow_id)

# Factory function
def create_payment_system(sui_connector=None):
    """Create hybrid payment system instance"""
    return HybridPaymentSystem(sui_connector)

# Example usage
if __name__ == "__main__":
    import asyncio
    
    async def test_payment_system():
        payment_system = create_payment_system()
        
        # Test deposit
        deposit = await payment_system.initiate_deposit(
            user_id="user123",
            phone_number="+254708374149",
            amount_kes=Decimal("10000"),
            project_reference="Test Project"
        )
        
        print(f"Deposit initiated: {asdict(deposit)}")
        
        # Test escrow creation
        milestones = [
            {"name": "Design Phase", "amount_percentage": 30, "amount_usdc": 21.0},
            {"name": "Development", "amount_percentage": 50, "amount_usdc": 35.0},
            {"name": "Testing", "amount_percentage": 20, "amount_usdc": 14.0}
        ]
        
        escrow = await payment_system.create_project_escrow(
            project_id="PROJ_001",
            client_user_id="client123",
            total_amount_kes=Decimal("10000"),
            milestones=milestones,
            participants=["dev1", "dev2", "designer1"]
        )
        
        print(f"Escrow created: {asdict(escrow)}")
    
    # Run test
    asyncio.run(test_payment_system())
