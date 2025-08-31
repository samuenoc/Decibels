// pages/index.tsx o app/page.tsx
'use client';
import ArbitrumBalanceChecker from "@/components/providers/balance";

export default function Home() {
    return (
        <div>
            <h1>Mi App</h1>
            <ArbitrumBalanceChecker />
        </div>
    );
}