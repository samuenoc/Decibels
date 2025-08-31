import { useWeb3 } from '@/hooks/web3';
import React, { useState, useEffect } from 'react';


interface ContractInfo {
    totalSongs: string;
    isArtist: boolean;
}

const BalanceChecker: React.FC = () => {
    const {
        balance,
        isLoading,
        error,
        walletAddress,
        contractAddress,
        refreshBalance,
        getContractInfo
    } = useWeb3();

    const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
    const [loadingContract, setLoadingContract] = useState(false);

    const handleGetContractInfo = async () => {
        setLoadingContract(true);
        const info = await getContractInfo();
        setContractInfo(info);
        setLoadingContract(false);
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Conectando con Arbitrum Sepolia...</span>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Web3 Balance Checker
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Wallet Address
                        </label>
                        <p className="text-sm text-gray-600 font-mono">
                            {formatAddress(walletAddress)}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contract Address
                        </label>
                        <p className="text-sm text-gray-600 font-mono">
                            {formatAddress(contractAddress)}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Balance (ETH)
                        </label>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-green-600">
                                {parseFloat(balance).toFixed(6)} ETH
                            </p>
                            <button
                                onClick={refreshBalance}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                                disabled={isLoading}
                            >
                                🔄
                            </button>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <button
                            onClick={handleGetContractInfo}
                            disabled={loadingContract}
                            className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {loadingContract ? 'Cargando...' : 'Obtener Info del Contrato'}
                        </button>

                        {contractInfo && (
                            <div className="mt-4 p-4 bg-gray-100 rounded">
                                <h3 className="font-semibold text-gray-800 mb-2">Información del Contrato:</h3>
                                <div className="space-y-1 text-sm">
                                    <p><strong>Total de canciones:</strong> {contractInfo.totalSongs}</p>
                                    <p><strong>Es artista:</strong> {contractInfo.isArtist ? '✅ Sí' : '❌ No'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalanceChecker;