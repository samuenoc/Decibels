// utils/arbitrumBalance.ts

interface RpcResponse {
    jsonrpc: string;
    id: number;
    result?: string;
    error?: {
        code: number;
        message: string;
    };
}

interface BalanceResult {
    eth: number;
    wei: string;
    address: string;
    network: 'arbitrum';
}

/**
 * Obtiene el balance de ETH de una dirección en Arbitrum
 * @param address - Dirección de la wallet (0x...)
 * @returns Promise con el balance en ETH y Wei
 */
export async function getArbitrumBalance(address: string): Promise<BalanceResult> {
    try {
        console.log('🔍 Fetching Arbitrum balance for:', address);

        // Validar formato de dirección
        if (!address.startsWith('0x') || address.length !== 42) {
            throw new Error('Invalid Ethereum address format');
        }

        // RPCs que funcionan mejor desde localhost con CORS habilitado
        const rpcUrls = [
            'https://arb1.arbitrum.io/rpc',
            'https://arbitrum.meowrpc.com',
            'https://arbitrum.drpc.org',
            'https://rpc.arb1.arbitrum.gateway.fm',
            'https://endpoints.omniatech.io/v1/arbitrum/one/public'
        ];

        let lastError: Error | null = null;

        // Intentar con cada proveedor hasta que uno funcione
        for (const rpcUrl of rpcUrls) {
            try {
                console.log(`🔄 Trying RPC: ${rpcUrl}`);

                const response = await fetch(rpcUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_getBalance',
                        params: [address.toLowerCase(), 'latest'],
                        id: 1
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data: RpcResponse = await response.json();

                if (data.error) {
                    throw new Error(`RPC Error: ${data.error.message}`);
                }

                if (!data.result) {
                    throw new Error('No balance data received');
                }

                // Convertir de hex Wei a decimal
                const balanceWei = BigInt(data.result);
                const balanceEth = Number(balanceWei) / (10 ** 18);

                const result: BalanceResult = {
                    eth: balanceEth,
                    wei: balanceWei.toString(),
                    address: address.toLowerCase(),
                    network: 'arbitrum'
                };

                console.log(`✅ Success with ${rpcUrl}`);
                console.log('💰 Balance Result:', result);

                return result;

            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown error');
                console.log(`❌ Failed with ${rpcUrl}:`, lastError.message);
                continue; // Intentar con el siguiente proveedor
            }
        }

        // Si todos los proveedores fallaron
        throw new Error(`All RPC providers failed. Last error: ${lastError?.message}`);

    } catch (error) {
        console.error('❌ Error fetching Arbitrum balance:', error);
        throw error;
    }
}

/**
 * Alternativa usando Alchemy (gratis, muy confiable)
 * Solo necesitas crear cuenta gratuita en alchemy.com
 * @param address - Dirección de la wallet
 * @param apiKey - Tu API key de Alchemy (opcional)
 */
export async function getArbitrumBalanceAlchemy(
    address: string,
    apiKey?: string
): Promise<BalanceResult> {
    try {
        console.log('🔍 Using Alchemy for Arbitrum balance...');

        if (!address.startsWith('0x') || address.length !== 42) {
            throw new Error('Invalid Ethereum address format');
        }

        // URL base de Alchemy para Arbitrum
        const baseUrl = apiKey
            ? `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`
            : 'https://arb-mainnet.g.alchemy.com/v2/demo'; // Demo key limitado

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [address.toLowerCase(), 'latest'],
                id: 1
            })
        });

        if (!response.ok) {
            throw new Error(`Alchemy HTTP ${response.status}: ${response.statusText}`);
        }

        const data: RpcResponse = await response.json();

        if (data.error) {
            throw new Error(`Alchemy RPC Error: ${data.error.message}`);
        }

        if (!data.result) {
            throw new Error('No balance data from Alchemy');
        }

        const balanceWei = BigInt(data.result);
        const balanceEth = Number(balanceWei) / (10 ** 18);

        const result: BalanceResult = {
            eth: balanceEth,
            wei: balanceWei.toString(),
            address: address.toLowerCase(),
            network: 'arbitrum'
        };

        console.log('✅ Success with Alchemy');
        console.log('💰 Balance Result:', result);

        return result;

    } catch (error) {
        console.error('❌ Alchemy failed:', error);
        throw error;
    }
}

/**
 * Función robusta que intenta primero RPCs públicos, luego Alchemy demo
 */
export async function getArbitrumBalanceRobust(address: string): Promise<BalanceResult> {
    try {
        // Intentar primero con RPCs públicos
        return await getArbitrumBalance(address);
    } catch (publicRpcError) {
        console.log('🔄 Public RPCs failed, trying Alchemy demo...');
        try {
            // Fallback a Alchemy con demo key
            return await getArbitrumBalanceAlchemy(address);
        } catch (alchemyError) {
            console.error('❌ All methods failed');
            throw new Error(`Public RPCs failed: ${publicRpcError}. Alchemy failed: ${alchemyError}`);
        }
    }
}

/**
 * Obtiene solo el balance en ETH (número)
 */
export async function getArbitrumBalanceEth(address: string): Promise<number> {
    const result = await getArbitrumBalanceRobust(address);
    return result.eth;
}

/**
 * Obtiene el balance formateado como string
 */
export async function getFormattedArbitrumBalance(
    address: string,
    decimals: number = 6
): Promise<string> {
    const result = await getArbitrumBalanceRobust(address);
    return `${result.eth.toFixed(decimals)} ETH`;
}

// Constantes útiles
export const ARBITRUM_RPC_URLS = [
    'https://arb1.arbitrum.io/rpc',
    'https://arbitrum.meowrpc.com',
    'https://arbitrum.drpc.org',
    'https://rpc.arb1.arbitrum.gateway.fm',
    'https://endpoints.omniatech.io/v1/arbitrum/one/public'
];

export const WEI_TO_ETH = 10 ** 18;

// Tu dirección específica como constante
export const MY_WALLET_ADDRESS = '0x1b5adfa2b6aff816dcedef99c405bf3626698632';

/**
 * Función de conveniencia para tu wallet específica
 */
export async function getMyBalance(): Promise<BalanceResult> {
    return getArbitrumBalanceRobust(MY_WALLET_ADDRESS);
}

/**
 * Función simple para testing rápido
 */
export async function quickBalanceCheck(): Promise<void> {
    try {
        console.log('🚀 Quick balance check...');
        const balance = await getMyBalance();
        console.log(`💰 Your balance: ${balance.eth.toFixed(6)} ETH`);
    } catch (error) {
        console.error('❌ Quick check failed:', error);
    }
}