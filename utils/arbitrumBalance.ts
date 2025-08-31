// utils/arbitrumBalance.ts
import Web3 from 'web3';

interface BalanceResult {
    eth: string; // String para mantener precisión como en useWeb3
    wei: string;
    address: string;
    network: 'arbitrum-sepolia';
}

/**
 * Configuración base - EXACTAMENTE igual que en useWeb3.ts
 */
const getBaseConfig = () => ({
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    contractAddress: '0xae38a87b0b7097893f2313250cf7f319b069a1a2',
    networkId: 421614
});

/**
 * Obtiene el balance usando EXACTAMENTE la misma lógica que useWeb3
 * @param address - Dirección de la wallet (0x...)
 * @returns Promise con el balance en ETH y Wei
 */
export async function getArbitrumBalance(address: string): Promise<BalanceResult> {
    try {
        console.log('🔍 Fetching Arbitrum Sepolia balance for:', address);

        // Validar formato de dirección
        if (!address.startsWith('0x') || address.length !== 42) {
            throw new Error('Invalid Ethereum address format');
        }

        const config = getBaseConfig();

        // Inicializar Web3 con el RPC de Arbitrum Sepolia - IGUAL que useWeb3
        const web3Instance = new Web3(config.rpcUrl);

        // Obtener balance EXACTAMENTE como en useWeb3
        const balanceWei = await web3Instance.eth.getBalance(address);
        const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');

        const result: BalanceResult = {
            eth: balanceEth, // String, igual que en useWeb3
            wei: balanceWei.toString(), // Convert bigint to string
            address: address.toLowerCase(),
            network: 'arbitrum-sepolia'
        };

        console.log('✅ Success with Arbitrum Sepolia');
        console.log('💰 Balance Result:', result);

        return result;

    } catch (error) {
        console.error('❌ Error fetching Arbitrum Sepolia balance:', error);
        throw error;
    }
}

/**
 * Función que replica EXACTAMENTE getBalance de useWeb3
 * @param web3Instance - Instancia opcional de Web3
 * @param targetWallet - Wallet objetivo
 * @returns Balance en ETH como string
 */
export async function getBalanceExactAsUseWeb3(
    web3Instance?: Web3,
    targetWallet?: string
): Promise<string> {
    try {
        const config = getBaseConfig();
        const web3ToUse = web3Instance || new Web3(config.rpcUrl);
        const wallet = targetWallet;

        if (!web3ToUse || !wallet) {
            throw new Error('Missing web3 instance or wallet address');
        }

        // EXACTAMENTE la misma lógica que useWeb3.getBalance()
        const balanceWei = await web3ToUse.eth.getBalance(wallet);
        const balanceEth = web3ToUse.utils.fromWei(balanceWei, 'ether');

        return balanceEth;
    } catch (err) {
        console.error('Error obteniendo balance:', err);
        throw new Error('Error obteniendo balance');
    }
}

/**
 * Obtiene solo el balance en ETH como número
 */
export async function getArbitrumBalanceEth(address: string): Promise<number> {
    const result = await getArbitrumBalance(address);
    return parseFloat(result.eth);
}

/**
 * Obtiene el balance formateado como string
 */
export async function getFormattedArbitrumBalance(
    address: string,
    decimals: number = 6
): Promise<string> {
    const result = await getArbitrumBalance(address);
    const ethNumber = parseFloat(result.eth);
    return `${ethNumber.toFixed(decimals)} ETH`;
}

/**
 * Inicializa Web3 exactamente como useWeb3.initWeb3()
 */
export async function initWeb3LikeHook(): Promise<{ web3: Web3, contractAddress: string }> {
    try {
        const config = getBaseConfig();

        // Inicializar Web3 con el RPC de Arbitrum Sepolia
        const web3Instance = new Web3(config.rpcUrl);

        return {
            web3: web3Instance,
            contractAddress: config.contractAddress
        };

    } catch (err) {
        console.error('Error inicializando Web3:', err);
        throw new Error('Error conectando con la blockchain');
    }
}

// Constantes - usando la misma configuración que useWeb3
export const ARBITRUM_SEPOLIA_RPC = getBaseConfig().rpcUrl;
export const CONTRACT_ADDRESS = getBaseConfig().contractAddress;
export const NETWORK_ID = getBaseConfig().networkId;

// Tu dirección específica como constante
export const MY_WALLET_ADDRESS = '0x1b5adfa2b6aff816dcedef99c405bf3626698632';

/**
 * Función de conveniencia para tu wallet específica
 */
export async function getMyBalance(): Promise<BalanceResult> {
    return getArbitrumBalance(MY_WALLET_ADDRESS);
}

/**
 * Función simple para testing rápido - usa la misma red que useWeb3
 */
export async function quickBalanceCheck(address?: string): Promise<void> {
    try {
        console.log('🚀 Quick balance check on Arbitrum Sepolia...');
        const targetAddress = address || MY_WALLET_ADDRESS;
        const balance = await getArbitrumBalance(targetAddress);
        console.log(`💰 Balance: ${parseFloat(balance.eth).toFixed(6)} ETH`);
        console.log(`📍 Network: Arbitrum Sepolia (${NETWORK_ID})`);
    } catch (error) {
        console.error('❌ Quick check failed:', error);
    }
}

/**
 * Función que simula exactamente refreshBalance de useWeb3
 */
export async function refreshBalance(address: string): Promise<string> {
    try {
        const balanceEth = await getBalanceExactAsUseWeb3(undefined, address);
        return balanceEth;
    } catch (error) {
        console.error('Error refreshing balance:', error);
        throw error;
    }
}