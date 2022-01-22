# CryptoBatz Metadata

This repository contains the complete NFT metadata for the **CryptoBatz by Ozzy Osbourne NFT** collection, as well as the method for verifying the provenance hash stored in the Smart Contract.

There are 2 metadata folders.

### provenance-metadata

This is the original set of pre-randomized metadata that was generated before sales started on the collection.  The provenance hash was calculated on this set of files and the result was stored in the Smart Contract at this transaction [0x0457a4ad5d6e8469ade8f56f23e069c72041c74b7298798c9382ffd4515d6242](https://etherscan.io/address/0xc8adfb4d437357d0a656d4e62fd9a6d22e401aa0).

The provenance hash for each metadata file is first calculated from a combination of 
* Its original sequence number between 1-9666
* The IPFS CID of the image file
* The list of attribute names sorted in alphabetical order
* The corresponding list of attribute values

Then the array of individual hashes are combined in sequence into the final Provenance Hash.  The provenance hash worked out to be:

`0xac1fc38a32c10839c94c191d02f346b7c51f2eac01db843b6be96412d90ada2c`

### final-metadata

This is the final set of metadata that is uploaded to the smart contract and will allocate each holder their CryptoBat forever.  This set of metadata is generated after the rollStartIndex function was called on the CryptoBatz smart contract at this transaction [0x7ca6861178a3f7e7c428bffffa750ffbedc1674b1084f9ddd529c9dd0f9fa8c4](https://etherscan.io/tx/0x7ca6861178a3f7e7c428bffffa750ffbedc1674b1084f9ddd529c9dd0f9fa8c4).

The Random Start Index that was generated is `6907`.  This meant that #6907 from the `provenance-metadata` folder now became #1 in `final-metadata`, and everything else was also offset accordingly.

## calculating the provenance hash

You can calculate the provenance hash on the final-metadata folder for yourself to verify that it matches the original that was set in the smart contract.

Name sure you've installed a current version of Node.js.

Clone this repository to your machine, open a terminal in this directory.

Run `npm install` to install dependencies.

Run `npm run calculate` to calculate the hash on the current contents of the `final-metadata` folder, using `6907` as the starting index offset.

You can always download the actual metadata files from the IPFS link that's set in the Smart Contract, put those in the `final-metadata` folder, then run the script, so you don't have to trust what's committed to this repository.

You can make modifications to the files in the `final-metadata` directory, and verify that you would get a different hash as a result.