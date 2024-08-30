import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { derivePath } from "ed25519-hd-key";
import { Clipboard } from "lucide-react";  // Import the Clipboard icon

export function SolanaWallet({ mnemonic }: { mnemonic: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wallets, setWallets] = useState<{ publicKey: string; privateKey: string; }[]>([]);
    const [showDetails, setShowDetails] = useState<number | null>(null);

    const handleAddWallet = async () => {
        try {
            const seed = mnemonicToSeed(mnemonic.join(" "));
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const seedHex = (await seed).toString('hex')
            const derivedSeed = derivePath(path, seedHex).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(new Uint8Array(secret));
            const publicKey = keypair.publicKey.toBase58();
            const privateKey = Buffer.from(secret).toString('hex');

            setCurrentIndex(currentIndex + 1);
            setWallets([...wallets, { publicKey, privateKey }]);
        } catch (error) {
            console.error("Error adding wallet:", error);
        }
    };

    const handleShowDetails = (index: number) => {
        setShowDetails(showDetails === index ? null : index);
    };

    const handleCopyPrivateKey = (privateKey: string) => {
        navigator.clipboard.writeText(privateKey)
            .then(() => alert('Private key copied to clipboard!'))
            .catch(err => console.error('Failed to copy private key: ', err));
    };

    return (
        <div className="p-4 space-y-4 flex flex-col items-center w-full mx-auto">
            <Button onClick={handleAddWallet}>
                Add Sol wallet
            </Button>
            {wallets.length > 0 && (
                <div className="w-full bg-gray-800 p-4 rounded-xl shadow-lg drop-shadow-2xl">
                    {wallets.map((wallet, index) => (
                        <Card key={index} className="mb-4 p-4 border rounded-lg shadow-md">
                            <CardContent className="text-lg font-semibold text-black mb-2">
                                Address: <span className="block break-all">{wallet.publicKey}</span>
                            </CardContent>
                            <Button
                                onClick={() => handleCopyPrivateKey(wallet.publicKey)}
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
}
