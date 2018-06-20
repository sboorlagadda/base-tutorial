'use strict';

import Base from "./lib/Bitclave-Base";

//required for babel to polyfill regeneratorRuntime
require("babel-polyfill");

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

(function() {
    //Define a passphrase
    const passphrase = 'some passphrase';
    
    //Initialize Base
    const base = new Base("https://base-node-staging.herokuapp.com", 'localhost', '', '');
    base.changeStrategy('POSTGRES');
    
    //Create a KeyPair
    base.createKeyPairHelper('').createKeyPair(passphrase).then(async keyPair => {

        console.log("\nCreated a keypair for the passphrase: " + passphrase);
        console.log("PublicKey:" + keyPair.publicKey);
        console.log("PrivateKey:" + keyPair.privateKey);

        //Check for existence or create a new account
        let account;
        try {
           console.log("\nChecking if account already exists.");
           account = await base.accountManager.checkAccount(passphrase, "somemessage");
           console.log("Account already exists: " + JSON.stringify(account));
        } catch(e) {
           console.log("\nAccount doesn't exist, Creating a new one.");
           account = await base.accountManager.registration(passphrase, "somemessage");
           console.log("Account created:" + JSON.stringify(account));
        }

        let data = new Map();
        data.set("firstname", "John");
        data.set("lastname", "Doe");
        data.set("email", "john.doe@gmail.com");
        data.set("city", "NewYork");

        // Save encrypted data to Base
        let encryptedData = await base.profileManager.updateData(data);
        console.log("\nUser data is encrypted and saved to Base.");
        for (var [key, value] of encryptedData.entries()) {
            console.log("Key:" + key + ", Encrypted Value:" + value);
        }

        // Read saved data and decrypt
        let decryptedData = await base.profileManager.getData();
        console.log("\nUser data is retrieved from Base and decrypted.");
        for (var [key, value] of decryptedData.entries()) {
            console.log("Key:" + key + ", Decrypted Value:" + value);
        }
    });
})();