import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet } from "ethers";
import { HDNode } from "@ethersproject/hdnode";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Clipboard } from "lucide-react";  // Import the Clipboard icon

interface EthWalletProps {
    mnemonic: string[];
}

export const EthWallet = ({ mnemonic }: EthWalletProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wallets, setWallets] = useState<{ address: string; privateKey: string; }[]>([]);
    const [showDetails, setShowDetails] = useState<number | null>(null);

    const handleAddWallet = async () => {
        try {
            const seed = await mnemonicToSeed(mnemonic.join(" "));
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const hdNode = HDNode.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const privateKey = child.privateKey;
            const wallet = new Wallet(privateKey);
            const address = wallet.address;

            setCurrentIndex(currentIndex + 1);
            setWallets([...wallets, { address, privateKey }]);
        } catch (error) {
            console.error("Error adding wallet:", error);
        }
    };

    const handleShowDetails = (index: number) => {
        setShowDetails(showDetails === index ? null : index);
    };

    const handleCopyPublicKey = (publicKey: string) => {
        navigator.clipboard.writeText(publicKey)
            .then(() => console.log('Private key copied to clipboard!'))
            .catch(err => console.error('Failed to copy private key: ', err));
    };

    return (
        <div className="p-4 space-y-4 flex flex-col items-center w-full mx-auto">
            <Button onClick={handleAddWallet}>
                Add ETH wallet
            </Button>
            {wallets.length > 0 && (
                <div className="w-full bg-gray-800 p-4 rounded-xl shadow-lg drop-shadow-2xl">
                    {wallets.map((wallet, index) => (
                        <Card key={index} className="mb-4 p-4 border rounded-lg shadow-md">
                            <CardContent className="text-lg font-semibold text-black mb-2">
                                Address: <span className="block break-all">{wallet.address}</span>
                            </CardContent>
                            <Button
                                onClick={() => handleCopyPublicKey(wallet.address)}
                                variant="secondary"
                                className="flex items-center gap-2 bg-gray-600 text-white hover:bg-gray-700"
                            >
                                <Clipboard className="h-4 w-4" /> Copy Address
                            </Button>
                            {showDetails === index && (
                                <div className="text-sm text-black space-y-2 mt-2">
                                    <CardContent>
                                        Private Key: <span className="block break-all">{wallet.privateKey}</span>
                                    </CardContent>
                                    
                                </div>
                            )}
                            <Button
                                onClick={() => handleShowDetails(index)}
                                variant="secondary"
                                className={`${showDetails === index? "" : "mt-2"} bg-gray-600 text-white hover:bg-gray-700`}
                            >
                                {showDetails === index ? 'Hide Details' : 'Show Details'}
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
