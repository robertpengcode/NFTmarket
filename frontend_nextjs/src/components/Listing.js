import { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import Card from "../components/Card";

export default function Listing({
  listing,
  nftContract,
  selectedAttributes,
  marketFeePercent,
  royaltyPercent,
}) {
  const { walletAddress } = useGlobalContext();
  const [nftImgURL, setNftImgURL] = useState("");
  const [showNFT, setShowNFT] = useState(true);
  const [attributes, setAttributes] = useState([]);

  const { nftContractAddr, tokenId, seller, price } = listing;

  const getNftUri = async () => {
    const nftURI = await nftContract.tokenURI(tokenId.toString());
    const response = await (await fetch(nftURI)).json();
    setAttributes(response.attributes);
    setNftImgURL(response.image);
  };

  useEffect(() => {
    if (nftContract && tokenId) {
      getNftUri();
    }
  }, [nftContract]);

  useEffect(() => {
    if (nftContract && tokenId) {
      setShowNFT(checkAttributes(attributes));
    }
  }, [nftContract, selectedAttributes]);

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

  const totalPrice = (
    (price * (100 + Number(marketFeePercent) + Number(royaltyPercent))) /
    100
  ).toString();

  return !listing || showNFT === false ? null : (
    <Card
      imgURL={nftImgURL}
      tokenId={tokenId}
      seller={seller}
      totalPrice={totalPrice}
      walletAddress={walletAddress}
      nftContractAddr={nftContractAddr}
    />
  );
}
