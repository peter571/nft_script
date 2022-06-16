import jsonfile from 'jsonfile';
import { resolveEnsName } from './ens.js';
import { readFile } from 'fs';
import Web3 from 'web3';
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
import 'dotenv/config'
const require = createRequire(import.meta.url); // construct the require method
const CONFIG = require("./data/config.json"); // use the require method
const ABI = require('./data/abi.json');

var _entrant, _leaderboard, _timestamp, abi, config, entrants, erc721Contract, erc721ContractAddress, nftTotalSupply, owners, ownersOccurence, tokenID, tokenOwner, w3, w3ETH;

config = CONFIG;
abi = ABI;

w3 = new Web3(new Web3.providers.HttpProvider(`https://polygon-mainnet.infura.io/v3/${process.env.ID}`));

erc721ContractAddress = config["contract_address"];
erc721ContractAddress = w3.utils.toChecksumAddress(erc721ContractAddress);
erc721Contract = new w3.eth.Contract(abi, erc721ContractAddress);

async function getHolders() {
    try {
        nftTotalSupply = await erc721Contract.methods.totalSupply().call();

    _timestamp = new Date().getTime();

    owners = [];

    for (var i = 0; i < nftTotalSupply; i += 1) {
        tokenID = await erc721Contract.methods.tokenByIndex(i).call();
        tokenOwner = await erc721Contract.methods.ownerOf(tokenID).call();
        owners.push(tokenOwner);
    }

    ownersOccurence = [...new Set(owners)];
    entrants = [];

    for (var i = 0; i < ownersOccurence.length; i += 1) {
        _entrant = {};
        _entrant["address"] = w3.utils.toChecksumAddress(ownersOccurence[i]);
        _entrant["pieces_owned"] = await erc721Contract.methods.balanceOf(ownersOccurence[i]).call();
        _entrant["ens_name"] = await resolveEnsName(w3.utils.toChecksumAddress(ownersOccurence[i]));
        entrants.push(_entrant);
    }

    _leaderboard = {};
    _leaderboard["updated_at"] = _timestamp;
    _leaderboard["holders"] = entrants.sort(function (a, b) { return b.pieces_owned - a.pieces_owned });;

    jsonfile.writeFileSync('./data/leaderboard.json', _leaderboard, { spaces: 2 });

    } catch (error) {
        console.log(error);
    }
    
}

export default getHolders;
