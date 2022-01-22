const fs = require("fs");
const ethers = require('ethers');
const ethersKeccak = ethers.utils.keccak256;
const abiEncoder = ethers.utils.defaultAbiCoder;
const BN = ethers.BigNumber;

const metadataDirectory = "./final-metadata"
const startIndexOffset = 6907

const calculateProvenanceHash = async (directory, offset) => {

  if (!fs.existsSync(directory)) {
    console.error(`${directory} doesn't exist`);
    return;
  }

  try {
    let metadataHashes = {};

    let files = fs.readdirSync(directory).sort(naturalCompare);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let json = fs.readFileSync(`${directory}/${file}`);
      let metadata = JSON.parse(json);

      let hash = hashMetadata(metadata);
      // reverse the offset to get the original sequence number for this token
      let originalIndex = (Number(file) + offset - 2) % 9666 + 1

      metadataHashes[originalIndex] = hash;
    }

    let sortedHashes = Object.keys(metadataHashes).sort((a,b) => Number(a) - Number(b)).map(index => metadataHashes[index]);
    let provenanceHash = sortedHashes.reduce(combineHashes);

    console.log(`Calculated Provenance Hash = ${provenanceHash}`);

    return provenanceHash;

  } catch (error) {
    console.log(error);
  }
}

function normalizeMetadata(metadata) {
  sortedAttrs = metadata.attributes.sort((a, b) => {
    if (a.trait_type < b.trait_type) {
      return -1;
    }
    if (a.trait_type > b.trait_type) {
      return 1;
    }
    return 0;
  });

  return {
    originalSequenceId: BN.from(metadata.provenanceSequence),
    imageIpfsUri: metadata.image,
    attributeNames: sortedAttrs.map((e) => { return e.trait_type }),
    attributeValues: sortedAttrs.map((e) => { return e.value }),
  };
}

function hashMetadata(metadata) {
  const normMetadata = normalizeMetadata(metadata);

  return ethersKeccak(
    abiEncoder.encode(
      ['uint256', 'string', 'string[]', 'string[]'],
      [normMetadata.originalSequenceId, normMetadata.imageIpfsUri, normMetadata.attributeNames, normMetadata.attributeValues]
    )
  );
}

function combineHashes(hash1, hash2) {
  return ethersKeccak(
    abiEncoder.encode(
      ['string', 'string'],
      [hash1, hash2]
    )
  );
}

function naturalCompare(a, b) {
  var ax = [], bx = [];

  a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
  b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
  
  while(ax.length && bx.length) {
      var an = ax.shift();
      var bn = bx.shift();
      var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
      if(nn) return nn;
  }

  return ax.length - bx.length;
}

exports.calculateProvenanceHash = calculateProvenanceHash;

const main = async () => {
  calculateProvenanceHash(metadataDirectory, startIndexOffset);
}

main();