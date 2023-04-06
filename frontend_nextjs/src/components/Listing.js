import { useState } from "react";
import { useGlobalContext } from "../context";
import Card from "../components/Card";

export default function Listing({ listing, nftContract, selectedAttributes }) {
  const { walletAddress } = useGlobalContext();
  const [nftImgURL, setNftImgURL] = useState("");
  const [showNFT, setShowNFT] = useState(true);

  const { nftContractAddr, tokenId, seller, price } = listing;

  const getNftUri = async () => {
    const nftURI = await nftContract.tokenURI(tokenId.toString());
    const response = await (await fetch(nftURI)).json();
    setShowNFT(checkAttributes(response.attributes));
    setNftImgURL(response.image);
  };

  if (nftContract && tokenId) {
    getNftUri();
  }

  //to determine show this NFT or not
  function checkAttributes(attributesArr) {
    for (let i = 0; i < attributesArr.length; i++) {
      const { value } = attributesArr[i];
      if (selectedAttributes.includes(value) === false) {
        return false;
      }
    }
    return true;
  }

  return !listing || showNFT === false ? null : (
    <Card
      imgURL={nftImgURL}
      tokenId={tokenId}
      seller={seller}
      price={price}
      walletAddress={walletAddress}
      nftContractAddr={nftContractAddr}
    />
  );
}
