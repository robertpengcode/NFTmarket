const collections = [
  {
    name: "Friends",
    address: "testAddr1",
    imageURL: "testImageURL1",
    description: "Friends play with each other.",
    supply: "10",
    team: "NOZO_ART",
    attributes: ["personality", "skill", "greeting"],
  },
  {
    name: "Bored Students",
    address: "testAddr2",
    imageURL: "testImageURL2",
    description: "Bored kids in school.",
    supply: "100",
    team: "NOZO_ART",
    attributes: ["background", "eyes", "mouth", "hair", "color", "clothing"],
  },
  {
    name: "Crypto Robots",
    address: "testAddr3",
    imageURL: "testImageURL3",
    description: "Crypto Robots in the metaverse.",
    supply: "50",
    team: "COOLDAD",
    attributes: ["background", "type", "height", "mood", "tool", "color"],
  },
];

const boredStudentsAttributes = {
  background: ["yellow", "green", "blue", "purple", "pink"],
  eyes: ["open", "closed", "glasses", "sun glasses"],
  mouth: ["smile", "sad", "teeth", "tongue"],
  hair: ["short", "long", "medium", "punk"],
  color: ["brown", "white", "yellow"],
  clothing: ["tie", "shirt", "polo", "jersey"],
};

module.exports = { collections, boredStudentsAttributes };
