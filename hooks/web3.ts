// hooks/useWeb3.ts
import { useState, useEffect } from 'react';
import Web3 from 'web3';

interface ContractConfig {
    rpcUrl: string;
    contractAddress: string;
    networkId: number;
    walletAddress: string;
}

const CONFIG: ContractConfig = {
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    contractAddress: '0x9C9a5e82A973c6976123fd5b29376f9A27DA0633',
    networkId: 421614,
    walletAddress: localStorage.getItem('walletAddressX') || ''
};

const CONTRACT_ABI = [
    {
        "inputs": [{ "internalType": "address", "name": "artist_address", "type": "address" }],
        "name": "getArtist",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getConfig",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "song_id", "type": "uint256" }],
        "name": "getPricePerPlay",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "song_id", "type": "uint256" }],
        "name": "getSong",
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" },
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalSongs",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUserAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "artist_address", "type": "address" }],
        "name": "isArtist",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    }
];

export const useWeb3 = () => {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [balance, setBalance] = useState<string>('0');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        initWeb3();
    }, []);

    const initWeb3 = async () => {
        try {
            setIsLoading(true);
            setError('');

            // Inicializar Web3 con el RPC de Arbitrum Sepolia
            const web3Instance = new Web3(CONFIG.rpcUrl);
            setWeb3(web3Instance);

            // Crear instancia del contrato
            const contractInstance = new web3Instance.eth.Contract(
                CONTRACT_ABI,
                CONFIG.contractAddress
            );
            setContract(contractInstance);

            // Obtener balance del wallet
            await getBalance(web3Instance);

        } catch (err) {
            console.error('Error inicializando Web3:', err);
            setError('Error conectando con la blockchain');
        } finally {
            setIsLoading(false);
        }
    };

    const getBalance = async (web3Instance?: Web3) => {
        try {
            const web3ToUse = web3Instance || web3;
            if (!web3ToUse) return;

            const balanceWei = await web3ToUse.eth.getBalance(CONFIG.walletAddress);
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
        if (!contract) return null;

        try {
            const totalSongs = await contract.methods.getTotalSongs().call();
            const isArtist = await contract.methods.isArtist(CONFIG.walletAddress).call();

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
        isLoading,
        error,
        walletAddress: CONFIG.walletAddress,
        contractAddress: CONFIG.contractAddress,
        refreshBalance,
        getContractInfo
    };
};
