const styles = {
  // Header
  navContainer:
    "font-righteous p-3 border-b-2 flex flex-row justify-between items-center",
  navLogoContainer: "flex flex-row",
  navLogo: "w-[70px] h-[70px] object-contain cursor-pointer",
  navMatic:
    "w-[25px] h-[25px] mx-1 px-1 border-r-2 border-dashed border-purple-400",
  navLogoContainer1: "flex flex-col items-center mx-2",
  navLogoContainer2: "flex flex-row",
  navLogoText1: "font-bold text-3xl mx-[1px]",
  navLogoText: "py-5 px-2 font-bold text-2xl",
  navItem: "text-1xl mx-4 p-2",
  navLink: "hover:bg-purple-200 border-b-[3px] rounded-t-lg",
  navButton: "rounded-xl bg-sitePurple hover:bg-purple-500 w-fit text-white",
  navConnectedBox:
    "flex flex-row text-sitePurple border-[2px] border-dashed border-purple-400 hover:bg-purple-200 rounded-xl p-1 mx-4",
  navTabOn:
    "text-1xl mx-4 p-2 border-b-[3px]  cursor-pointer border-sitePurple bg-purple-200 rounded-t-lg",

  // Page
  pageContainer: "flex flex-col font-righteous bg-purple-200 min-h-screen",

  // Home
  homePageContainer: "items-center",
  homeCollectionContainer:
    "flex flex-col w-[90%] border bg-white shadow-md rounded-lg m-4 pt-4 pb-8 items-center",
  homeBigTextContainer: "w-[90%] my-2",
  homeBigText: "text-2xl my-2",
  homeCollectionTable:
    "flex flex-col border-2 border-purple-300 rounded-lg w-[90%]",
  homeCollectionHeadRow: "flex flex-row h-12",
  homeCollectionRowItemBig: "w-[40%] flex items-center justify-center",
  homeCollectionRow:
    "flex flex-row cursor-pointer h-20 border-purple-300 border-t-2 hover:bg-purple-200",
  homeCollectionRowItem: "w-[20%] flex items-center justify-center ",
  homeCollectionImg: "border border-purple-200 h-[4rem] w-[4rem]",

  // Card
  cardContainer:
    "flex flex-col w-[200px] h-[320px] items-center rounded-lg overflow-hidden shadow-lg mx-2 my-2 pb-2 bg-white hover:border-2 hover:border-sitePurple",
  cardImage: "w-auto h-auto",
  cardText: "font-righteous mb-1",
  cardButton:
    "font-righteous rounded-md bg-sitePurple hover:bg-purple-500 w-fit text-white p-1 mb-1 cursor-pointer disabled:bg-purple-300",

  // Listing page
  listContainer: "flex flex-col flex-wrap p-4",
  listCollectionInfoContainer:
    "flex flex-col justify-evenly w-full rounded-lg bg-white shadow-md p-2",
  listCollectionInfoRow: "flex flex-row",
  listCollectionInfoItem:
    "p-1 my-1 mx-2 border-[2px] border-dashed border-purple-400 rounded-md hover:bg-purple-200",
  listContainer2: "flex flex-row w-full my-4",
  listAttributesContainer:
    "flex flex-col w-[18%] rounded-lg bg-white my-2 mr-2 shadow-md py-2",
  listAttributesText: "ml-2",
  listAttributesContainer2: "flex flex-col",
  listAttributesBox:
    "flex flex-col justify-between m-2 cursor-pointer border-[2px] border-dashed border-purple-400 rounded-md p-1 hover:bg-purple-200",
  listAttributesItem: "flex flex-row justify-between p-1",
  listAttributesMenu: "flex flex-col w-[95%] ml-1 mt-1",
  listCardsContainer: "flex flex-row flex-wrap w-[82%] h-fit",
  listAttributesMenuForm: "flex flex-row",
  listAttributesMenuFormLabel: "ml-1",

  // NFT page
  nftContainer: "flex flex-row p-4",
  nftInfoLeft:
    "flex flex-col w-[35%] bg-white rounded-lg items-center mr-2 shadow-md",
  nftInfoRight: "flex flex-col w-[65%] bg-white rounded-lg ml-2 shadow-md",
  nftInfoLeftItem: "my-2",
  nftImageContainer:
    "w-[80%] border-[2px] my-2 border-dashed border-purple-400 rounded-lg hover:border-solid hover:border-sitePurple",
  nftImage: "object-cover rounded-lg",
  nftBTN:
    "rounded-md bg-sitePurple hover:bg-purple-500 w-fit text-white p-1 my-2 cursor-pointer disabled:bg-purple-300",
  nftInfoRightItem: "flex flex-col m-2 rounded-lg",
  nftInfoRightItemText: "ml-2",
  nftDescriptionContainer:
    "border-[2px] border-dashed border-purple-400 m-2 rounded-md w-fit p-2 hover:bg-purple-200",
  nftAttributesContainer: "flex flex-row flex-wrap",
  nftAttributeBox:
    "flex flex-col items-center w-[200px] border-[2px] border-dashed border-purple-400 m-2 rounded-md p-2 hover:bg-purple-200",

  nftAttributeKey: "text-siteWhite",
  nftAttributeValue: "",
  nftAttributeRare: "text-sm",
  nftChartContainer:
    "border-[2px] border-dashed border-purple-400 m-2 rounded-md w-fit p-2 hover:bg-purple-200",

  // Forms on Sell-NFT page
  sellContainer:
    "flex flex-col font-righteous m-4 p-2 rounded-lg bg-white w-[70%] shadow-md",
  sellTabsBox: "flex flex-row m-1",
  sellTab:
    "text-1xl border-b-[3px] mr-4 my-1 p-1 cursor-pointer hover:bg-purple-200 hover:rounded-t-md",
  sellTabOn:
    "text-1xl border-b-[3px] mr-4 my-1 p-1 cursor-pointer border-sitePurple bg-purple-200 rounded-t-md",
  sellFormContainer: "flex flex-col font-righteous rounded-lg bg-white m-1 p-1",
  sellFormLabel: "mx-2 my-1",
  sellFormInput: "ml-4 mr-2 mt-1 mb-4 pl-1 border rounded-md",
  sellFormAttBox: "flex flex-row justify-between pl-4 my-1 mr-2 mb-2",
  sellFormLabelAttKey: "mr-2",
  sellFormInputAttKey: "mr-2 border rounded-md w-[20%]",
  sellFormLabelAttValue: "mr-2",
  sellFormInputAttValue: "border rounded-md w-[55%]",
  sellFormButton:
    "font-righteous rounded-md bg-sitePurple hover:bg-purple-500 w-fit text-white p-2 my-3 ml-2",

  // Footer
  footerContainer: "flex items-center justify-center bg-purple-200",
  footerText: "font-righteous",

  // alert
  info: "text-blue-700 bg-blue-100 dark:bg-blue-200 dark:text-blue-800",
  success: "text-green-700 bg-green-100 dark:bg-green-200 dark:text-green-800",
  failure:
    "text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800",
  alertContainer: "absolute z-10 top-[80px] w-[70%] left-[15%]",
  alertWrapper: "p-2 rounded-lg font-play font-semibold text-lg ",
  alertIcon: "flex-shrink-0 inline w-6 h-6 mr-2",
};

export default styles;
