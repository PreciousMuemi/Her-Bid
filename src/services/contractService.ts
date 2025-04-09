import { Contract, ethers } from 'ethers';
import UserRegistry from '@/contracts/UserRegistry.json';
import Escrow from '@/contracts/Escrow.json';
import { toast } from 'sonner';

export const createEscrow = async (
  freelancerAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<string> => {
  try {
    toast.info('Creating escrow...');
    const factory = new ethers.ContractFactory(
      Escrow.abi,
      Escrow.bytecode,
      signer
    );
    const escrow = await factory.deploy(freelancerAddress, {
      value: ethers.utils.parseEther(amount)
    });
    await escrow.deployed();
    toast.success('Escrow created successfully');
    return escrow.address;
  } catch (error) {
    console.error('Escrow creation failed:', error);
    toast.error('Failed to create escrow');
    throw error;
  }
};

export const releaseEscrowFunds = async (
  escrowAddress: string,
  signer: ethers.Signer
): Promise<void> => {
  try {
    toast.info('Releasing escrow funds...');
    const escrowContract = new ethers.Contract(
      escrowAddress,
      Escrow.abi,
      signer
    );
    const tx = await escrowContract.releaseFunds();
    await tx.wait();
    toast.success('Funds released successfully');
  } catch (error) {
    console.error('Failed to release escrow funds:', error);
    toast.error('Failed to release funds');
    throw error;
  }
};

export const initiateEscrowDispute = async (
  escrowAddress: string,
  signer: ethers.Signer
): Promise<void> => {
  try {
    toast.info('Initiating escrow dispute...');
    const escrowContract = new ethers.Contract(
      escrowAddress,
      Escrow.abi,
      signer
    );
    const tx = await escrowContract.initiateDispute();
    await tx.wait();
    toast.success('Dispute initiated successfully');
  } catch (error) {
    console.error('Failed to initiate dispute:', error);
    toast.error('Failed to initiate dispute');
    throw error;
  }
};

export const acceptBid = async (
  contractAddress: string,
  bidIndex: number,
  signer: ethers.Signer
): Promise<boolean> => {
  try {
    toast.info('Processing bid acceptance...');
    const contract = new ethers.Contract(
      contractAddress,
      UserRegistry.abi,
      signer
    );
    const tx = await contract.acceptBid(bidIndex);
    await tx.wait();
    toast.success('Bid accepted successfully');
    return true;
  } catch (error) {
    console.error('Failed to accept bid:', error);
    toast.error('Failed to accept bid');
    throw error;
  }
};

export const deployNewContract = async (
  contractData: any,
  signer: ethers.Signer
): Promise<string> => {
  try {
    toast.info('Deploying contract...');
    const factory = new ethers.ContractFactory(
      UserRegistry.abi,
      UserRegistry.bytecode,
      signer
    );
    const budgetWei = ethers.utils.parseEther(contractData.budget.toString());
    const deadlineTimestamp = Math.floor(new Date(contractData.deadline).getTime() / 1000);
    const skillsArray = contractData.skillsRequired
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 0);

    const contract = await factory.deploy();
    await contract.deployed();
    const contractAddress = contract.address;
    
    const deployedContract = new ethers.Contract(
      contractAddress,
      UserRegistry.abi,
      signer
    );
    
    await deployedContract.createContract(
      contractData.title,
      contractData.description,
      budgetWei,
      deadlineTimestamp,
      skillsArray
    );

    toast.success('Contract deployed successfully!');
    return contractAddress;
  } catch (error) {
    console.error('Contract deployment failed:', error);
    toast.error('Failed to deploy contract');
    throw error;
  }
};
