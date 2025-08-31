// hooks/useWeb3.ts
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import CONTRACT_ABI from '@/utils/abi.json';

interface ContractConfig {
    rpcUrl: string;
    contractAddress: string;
    networkId: number;
    walletAddress: string;
}

// Load configuration from environment variables
const getBaseConfig = () => ({
    rpcUrl: process.env.RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc',
    contractAddress: process.env.STYLUS_CONTRACT_ADDRESS || '0xae38a87b0b7097893f2313250cf7f319b069a1a2',
    networkId: parseInt(process.env.NETWORK_ID || '421614')
});

export const useWeb3 = () => {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [balance, setBalance] = useState<string>('0');
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        initWeb3();

        // Load wallet address from localStorage
        if (typeof window !== 'undefined') {
            const storedWallet = localStorage.getItem('walletAddressX')
            if (storedWallet) {
                setWalletAddress(storedWallet)
            }
        }
    }, []);

    const initWeb3 = async () => {
        try {
            setIsLoading(true);
            setError('');

            const config = getBaseConfig();

            // Inicializar Web3 con el RPC de Arbitrum Sepolia
            const web3Instance = new Web3(config.rpcUrl);
            setWeb3(web3Instance);

            // Crear instancia del contrato
            const contractInstance = new web3Instance.eth.Contract(
                CONTRACT_ABI,
                config.contractAddress
            );
            setContract(contractInstance);

            // Obtener balance del wallet si está disponible
            if (typeof window !== 'undefined') {
                const storedWallet = localStorage.getItem('walletAddressX')
                if (storedWallet) {
                    await getBalance(web3Instance, storedWallet);
                }
            }

        } catch (err) {
            console.error('Error inicializando Web3:', err);
            setError('Error conectando con la blockchain');
        } finally {
            setIsLoading(false);
        }
    };

    const getBalance = async (web3Instance?: Web3, targetWallet?: string) => {
        try {
            const web3ToUse = web3Instance || web3;
            const wallet = targetWallet || walletAddress;

            if (!web3ToUse || !wallet) return;

            const balanceWei = await web3ToUse.eth.getBalance(wallet);
            const balanceEth = web3ToUse.utils.fromWei(balanceWei, 'ether');
            setBalance(balanceEth);
        } catch (err) {
            console.error('Error obteniendo balance:', err);
            setError('Error obteniendo balance');
        }
    };

    const refreshBalance = async () => {
        setIsLoading(true);
        await getBalance();
        setIsLoading(false);
    };

    const getContractInfo = async () => {
        if (!contract || !walletAddress) return null;

        try {
            const totalSongs = await contract.methods.getTotalSongs().call();
            const isArtist = await contract.methods.isArtist(walletAddress).call();

            return {
                totalSongs: totalSongs.toString(),
                isArtist,
            };
        } catch (err) {
            console.error('Error obteniendo info del contrato:', err);
            return null;
        }
    };

    return {
        web3,
        contract,
        balance,
        walletAddress,
        isLoading,
        error,
        contractAddress: getBaseConfig().contractAddress,
        refreshBalance,
        getContractInfo,
        updateWalletAddress: (address: string) => {
            setWalletAddress(address)
            if (typeof window !== 'undefined') {
                localStorage.setItem('walletAddressX', address)
            }
        }
    };
};
