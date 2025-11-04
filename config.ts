import { mainnet, sepolia } from "wagmi/chains";
import { type Config, createConfig, http } from "wagmi";

const config: Config = createConfig({
    chains: [mainnet, sepolia],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
});

export default config;
