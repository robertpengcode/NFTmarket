import { gql, useQuery } from "@apollo/client";
const GET_NFTmarket_ITEMS = gql`
  {
    createdCollections(first: 5, orderBy: time) {
      id
      nftContractAddr
      royaltyAddr
      royaltyPercent
      collectionURI
      time
    }
    listedNFTs(first: 25, orderBy: time, orderDirection: desc) {
      id
      nftContractAddr
      tokenId
      seller
      price
      time
    }
    boughtNFTs(first: 50, orderBy: time) {
      id
      nftContractAddr
      tokenId
      buyer
      seller
      price
      time
    }
  }
`;

export const useSubgraph = () => {
  const { loading, error, data, refetch } = useQuery(GET_NFTmarket_ITEMS);
  return { loading, error, data, refetch };
};
