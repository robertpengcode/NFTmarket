import { gql, useQuery } from "@apollo/client";
const GET_NFTmarket_ITEMS = gql`
  {
    createdCollections(first: 5) {
      id
      nftContractAddr
      royaltyAddr
      royaltyPercent
      collectionURI
    }
    listedNFTs(first: 20) {
      id
      nftContractAddr
      tokenId
      seller
      price
    }
  }
`;

export const useSubgraph = () => {
  const { loading, error, data } = useQuery(GET_NFTmarket_ITEMS);
  return { loading, error, data };
};
