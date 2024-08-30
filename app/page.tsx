"use client";

import { EthWallet } from "@/components/EthWallet";
import { SolanaWallet } from "@/components/SolanaWallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateMnemonic } from "bip39";
import { Check, ArrowDown } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [displaySeed, setDisplaySeed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [seedCreated, setSeedCreated] = useState<boolean>(false)

  const handleCopy = async () => {
    try {
      const toBeCopied = mnemonic.join(" ");
      await navigator.clipboard.writeText(toBeCopied);
      console.log(toBeCopied);
      setCopied(true);
      setTimeout(() => {
        setCopied(false)
      }, 5000)
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <main className="h-screen w-screen bg-gray-200 overflow-y-scroll">
      {!seedCreated && (<div className="h-screen flex flex-col justify-center items-center gap-2 m-4">
        <p className="font-bold text-3xl">
          Wanna get into <span className="bg-white">BLOCKCHAIN</span> and <span className="bg-white">CRYPTOCURRENCIES</span>?
        </p>
        <ArrowDown className="h-12 w-12"/>
        <p className="font-semibold text-xl">
          Well, you need an account for that.
        </p>
        <ArrowDown className="h-12 w-12"/>
        <p className="font-semibold text-2xl">
          Create a seed phrase, get multiple accounts on the Ethereum and the Solana blockchain in a matter of seconds
        </p>
        <ArrowDown className="h-12 w-12"/>
        <Button
          className="bg-black"
          onClick={async function () {
            const mn = await generateMnemonic();
            const mnArr = mn.split(" ");
            setMnemonic(mnArr);
            setDisplaySeed(false);  
            setCopied(false); 
            setSeedCreated(true)
          }}
        >
          Create Seed Phrase
        </Button>
      </div>)}
      
      {seedCreated && (<div>
        {mnemonic.length > 0 && !displaySeed && (
        <div className="flex justify-center">
          <Button
            className="mt-8 bg-red-600 hover:bg-black"
            onClick={function () {
              setDisplaySeed(true);
            }}
          >
            Show Seed phrase
          </Button>
        </div>
      )}
        {displaySeed && (
          <div className="flex justify-center">
            <div className="mt-8 bg-black p-10 rounded-2xl shadow-xl drop-shadow-2xl">
              <div className="grid grid-cols-4 gap-4">
                {mnemonic.map((word, index) => (
                  <Input className="" key={index} type="text" value={word} readOnly />
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <Button
                  className="mt-8 bg-green-500 text-black hover:bg-white"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="inline-block mr-2" /> Copied
                    </>
                  ) : (
                    "Copy Seed Phrase"
                  )}
                </Button>
                <Button
                  className="mt-8 bg-yellow-500 text-black hover:text-white"
                  onClick={function () {
                    setDisplaySeed(false);
                  }}
                >
                  Hide Seed Phrase
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="p-2">
          <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-center">
            <div className="w-full mx-auto">
              <SolanaWallet mnemonic={mnemonic} />
            </div>
            <div className="w-full mx-auto">
              <EthWallet mnemonic={mnemonic} />
            </div>
          </div>
        </div>
      </div>)}
    </main>
  );
}