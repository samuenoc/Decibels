// utils/balanceChecker.js
import { ethers } from 'ethers';

export async function checkWalletBalance() {
    try {
        console.log('🚀 Iniciando consulta de balance...');

        const walletAddress = '0x1b5adfa2b6aff816dcedef99c405bf3626698632';

        // Proveedor RPC gratuito
        const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth');

        console.log('🔍 Consultando para dirección:', walletAddress);

        // Obtener balance
        const balance = await provider.getBalance(walletAddress);

        // Convertir de Wei a ETH
        const balanceInEth = ethers.formatEther(balance);

        console.log('📊 Resultados:');
        console.log('  - Balance en Wei:', balance.toString());
        console.log('  - Balance en ETH:', balanceInEth);
        console.log('  - Balance redondeado:', parseFloat(balanceInEth).toFixed(6), 'ETH');

        return balanceInEth;

    } catch (error) {
        console.error('❌ Error consultando balance:', error.message);
        throw error;
    }
}

// Función para usar en cualquier página
export async function logBalance() {
    try {
        await checkWalletBalance();
    } catch (error) {
        console.error('Error:', error);
    }
}

// pages/index.js - Ejemplo de uso
import { useEffect } from 'react';
import { logBalance } from '../utils/balanceChecker';

export default function Home() {
    useEffect(() => {
        // Ejecutar al cargar la página
        logBalance();
    }, []);

    return (
        <div>
            <h1>Revisa la consola del navegador 🚀</h1>
            <p>Presiona F12 para abrir DevTools</p>
        </div>
    );
}