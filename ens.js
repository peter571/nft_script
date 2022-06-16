import { ethers } from "ethers";
import 'dotenv/config';

export const resolveEnsName = async (address) => {

    const provider = new ethers.providers.InfuraProvider("homestead", {
        projectId: process.env.ID,
        projectSecret: process.env.SECRET
    });

    try {
        var ensName = await provider.lookupAddress(address);

        return ensName === null ? 'None' : ensName;
    } catch (error) {
        console.log(error)
        return 'None';
    }
}