import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { formatEther, isAddress, type Address } from "viem";
import { useBalance, useReadContract, WagmiProvider } from "wagmi";
import chainLinkAbi from "../chainLink.json";

import { mainnet, polygon } from "wagmi/chains";
import config from "../config";

const ETH_USD_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

function Dashboard() {
    const [walletAddress, setWalletAddress] = useState<Address | string | null>(
        null
    );
    const chainId = useRef<HTMLSelectElement>(null);

    const {
        data: walletBalance,
        error,
        isLoading,
    } = useBalance({
        chainId: Number(chainId?.current?.value),
        query: {
            enabled: !!walletAddress,
        },
    });

    const { data: ethUsdPrice, isLoading: ethPriceLoading } = useReadContract({
        abi: chainLinkAbi,
        address: ETH_USD_FEED,
        functionName: "latestRoundData",
        query: {
            enabled: walletBalance != undefined,
        },
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const handleWalletCheck = () => {
        const addressFromInput = inputRef?.current?.value;

        if (
            typeof addressFromInput != "undefined" &&
            isAddress(addressFromInput)
        ) {
            setWalletAddress(addressFromInput);
        }
    };

    useEffect(() => {
        if (walletAddress) console.log("Wallet Address: ", walletAddress);
    }, [walletAddress]);

    useEffect(() => {
        if (walletBalance) {
            console.log("Wallet Balance: ", formatEther(walletBalance?.value));
            console.log("Latest Round Data: ", ethUsdPrice);
        }
    }, [walletBalance, ethUsdPrice]);

    if (isLoading) {
        return <span>Loading...</span>;
    } else if (error) {
        console.log("An error just occured: ", error);
    }

    return (
        <div className="dashboard">
            <div className="error loading">
                {error && <span>{`${error}`}</span>}
                {isLoading && <span>Loading...</span>}
            </div>
            <div className="container">
                <h1>Check Wallet Balance</h1>
                <span className="input__group">
                    <input
                        type="text"
                        placeholder="Enter wallet address..."
                        ref={inputRef}
                    />
                    <select
                        className="group__item"
                        defaultValue={mainnet.id}
                        ref={chainId}
                    >
                        <option value={mainnet.id}>ETH</option>
                        <option value={polygon.id}>MATIC</option>
                    </select>
                </span>
                <span className="info__bar">
                    <span className="balance">
                        <span>
                            ${(walletBalance && `${walletBalance}`) || "0.00"}
                        </span>
                        <span>
                            ({`${walletBalance?.decimals || "00000000"}Gwei`})
                        </span>
                    </span>
                    <button onClick={handleWalletCheck}>
                        {isLoading ? (
                            <span>Loading...</span>
                        ) : (
                            <span>Check</span>
                        )}
                    </button>
                </span>
            </div>
        </div>
    );
}

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <Dashboard />
            </WagmiProvider>
        </QueryClientProvider>
    );
}

export default App;
