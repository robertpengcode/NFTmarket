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
  cardImage: "w-full",
  cardText: "font-righteous my-1",
  cardButton:
    "font-righteous rounded-md bg-sitePurple hover:bg-purple-500 w-fit text-white p-1 my-1 cursor-pointer",

  // Listing page
  listContainer: "flex flex-col flex-wrap p-4",
  listCollectionInfoContainer:
    "flex flex-col justify-evenly w-full h-[100px] rounded-lg bg-white shadow-md",
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
    "rounded-md bg-sitePurple hover:bg-purple-500 w-fit text-white p-1 my-2 cursor-pointer",
  nftInfoRightItem: "flex flex-col m-2 rounded-lg",
  nftInfoRightItemText: "ml-2",
  nftDescriptionContainer:
    "border-[2px] border-dashed border-purple-400 m-2 rounded-md w-fit p-2 hover:bg-purple-200",
  nftAttributesContainer: "flex flex-row flex-wrap",
  nftAttributeBox:
    "flex flex-col items-center w-[100px] border-[2px] border-dashed border-purple-400 m-2 rounded-md p-2 hover:bg-purple-200",
  nftAttributeKey: "text-siteWhite",
  nftAttributeValue: "",
  nftAttributeRare: "",

  // Forms on Sell-NFT page
  sellContainer:
    "flex flex-col font-righteous mt-2 m-2 p-2 rounded-lg bg-white w-[60%] shadow-md",
  sellTabsBox: "flex flex-row m-1",
  sellTab:
    "text-1xl border-b-[3px] mr-4 my-1 p-1 cursor-pointer hover:bg-purple-200 hover:rounded-t-md",
  sellTabOn:
    "text-1xl border-b-[3px] mr-4 my-1 p-1 cursor-pointer border-sitePurple bg-purple-200 rounded-t-md",
  sellFormContainer: "flex flex-col font-righteous rounded-lg bg-white m-1 p-1",
  sellFormLabel: "mx-2 my-1",
  sellFormInput: "ml-4 mr-2 mt-1 mb-4 pl-1 border rounded-md",
  sellFormButton:
    "font-righteous rounded-md bg-sitePurple hover:bg-purple-500 w-fit text-white p-2 my-3 ml-2",

  // Footer
  footerContainer: "flex items-center justify-center bg-purple-200",
  footerText: "font-righteous",

  // // general
  // headText: 'font-rajdhani font-bold text-white sm:text-6xl text-4xl',
  // normalText: 'font-rajdhani font-normal text-[24px] text-siteWhite',
  // footerText: 'font-rajdhani font-medium text-base text-white',
  // infoText: 'font-rajdhani font-medium text-lg text-siteViolet cursor-pointer',
  // // glassmorphism
  // glassEffect: 'bg-white backdrop-filter backdrop-blur-lg bg-opacity-10',
  // // hoc page
  // hocContainer: 'min-h-screen flex xl:flex-row flex-col relative',
  // hocContentBox: 'flex flex-1 justify-between bg-siteblack py-8 sm:px-12 px-8 flex-col',
  // hocLogo: 'w-[160px] h-[52px] object-contain cursor-pointer',
  // hocBodyWrapper: 'flex-1 flex justify-center flex-col xl:mt-0 my-16',
  // // join battle page
  // joinHeadText: 'font-rajdhani font-semibold text-2xl text-white mb-3',
  // joinContainer: 'flex flex-col gap-3 mt-3 mb-5',
  // joinBattleTitle: 'font-rajdhani font-normal text-xl text-white',
  // joinLoading: 'font-rajdhani font-normal text-xl text-white',
  // // battleground page
  // battlegroundContainer: 'min-h-screen bg-landing flex-col py-12 px-4',
  // battleGroundsWrapper: 'flex-wrap mt-10 max-w-[1200px]',
  // battleGroundCard: 'sm:w-[420px] w-full h-[260px] p-2 glass-morphism m-4 rounded-lg cursor-pointer battle-card',
  // battleGroundCardImg: 'w-full h-full object-cover rounded-md',
  // battleGroundCardText: 'font-rajdhani font-semibold text-2xl text-white',
  // // Game page
  // gameContainer: 'w-screen min-h-screen bg-cover bg-no-repeat bg-center flex-col',
  // gameMoveBox: 'sm:w-20 w-14 sm:h-20 h-14 rounded-full cursor-pointer border-[2px]',
  // gameMoveIcon: 'w-1/2 h-1/w-1/2 object-contain',
  // // player info component
  // playerImg: 'w-14 h-14 object-contain rounded-full',
  // playerHealth: 'flex flex-row bg-white rounded-md p-2 sm:min-w-[512px] min-w-[312px] sm:min-h-[48px] min-h-[40px] bg-opacity-10 backdrop-filter backdrop-blur-lg mx-3',
  // playerHealthBar: 'sm:w-4 w-2 sm:h-8 h-6 rounded-sm',
  // playerMana: 'w-14 h-14 rounded-full text-white font-rajdhani font-extrabold text-2xl cursor-pointer',
  // playerInfo: 'font-rajdhani font-medium',
  // playerInfoSpan: 'font-extrabold text-white',
  // // card component
  // cardContainer: 'relative sm:w-[260px] w-[220px] sm:h-[335px] h-[280px] z-0 transition-all',
  // cardImg: 'w-full h-full object-contain',
  // cardPointContainer: 'absolute sm:w-[40px] w-[32px] sm:h-[40px] h-[32px] rounded-[25px] bottom-[31.4%]',
  // cardPoint: 'font-rajdhani text-[20px] font-bold',
  // cardTextContainer: 'absolute w-full bottom-[13.5%] left-3',
  // cardText: 'font-rajdhani text-[26px] font-bold text-white',
  // // custom button component
  // btn: 'px-4 py-2 rounded-lg bg-siteViolet w-fit text-white font-rajdhani font-bold',
  // // custom input component
  // label: 'font-rajdhani font-semibold text-2xl text-white mb-3',
  // input: 'bg-siteDimBlack text-white outline-none focus:outline-siteViolet p-4 rounded-md sm:max-w-[50%] max-w-full',
  // // gameload component
  // gameLoadContainer: 'absolute inset-0 z-10 w-full h-screen gameload flex-col',
  // gameLoadBtnBox: 'w-full flex justify-end px-8',
  // gameLoadText: 'font-rajdhani text-siteWhite text-2xl mt-5 text-center',
  // gameLoadPlayersBox: 'flex justify-evenly items-center mt-20',
  // gameLoadPlayerImg: 'md:w-36 w-24 md:h-36 h-24 object-contain rounded-full drop-shadow-lg',
  // gameLoadPlayerText: 'mt-3 font-rajdhani text-white md:text-xl text-base',
  // gameLoadVS: 'font-rajdhani font-extrabold text-siteViolet text-7xl mx-16',
  // // gameInfo component
  // gameInfoIconBox: 'absolute right-2 top-1/2',
  // gameInfoIcon: 'bg-siteViolet w-10 h-10 rounded-md cursor-pointer',
  // gameInfoIconImg: 'w-3/5 h-3/5 object-contain invert',
  // gameInfoSidebar: 'absolute p-6 right-0 top-0 h-screen rounded-md flex-col transition-all ease-in duration-300',
  // gameInfoSidebarCloseBox: 'flex justify-end mb-8',
  // gameInfoSidebarClose: 'w-10 h-10 rounded-md bg-siteViolet text-white font-rajdhani font-extrabold text-xl cursor-pointer',
  // gameInfoHeading: 'font-rajdhani font-bold text-white text-3xl',
  // gameInfoText: 'font-rajdhani font-medium text-white text-xl mb-2',
  // // common
  // flexCenter: 'flex items-center justify-center',
  // flexEnd: 'flex justify-end items-end',
  // flexBetween: 'flex justify-between items-center',
  // // alert
  // info: 'text-blue-700 bg-blue-100 dark:bg-blue-200 dark:text-blue-800',
  // success: 'text-green-700 bg-green-100 dark:bg-green-200 dark:text-green-800',
  // failure: 'text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800',
  // alertContainer: 'absolute z-10 top-5 left-0 right-0',
  // alertWrapper: 'p-4 rounded-lg font-rajdhani font-semibold text-lg ',
  // alertIcon: 'flex-shrink-0 inline w-6 h-6 mr-2',
  // // modal
  // modalText: 'font-rajdhani font-bold text-3xl text-white mb-6 text-center',
};

export default styles;
