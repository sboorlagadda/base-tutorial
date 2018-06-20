'use strict';

import Base from "./lib/Bitclave-Base";
import * as os from 'os';

function demo() {
    const passphrase = 'some passphrase';
    
    const base = new Base("https://base-node-staging.herokuapp.com", 'localhost', '', '');
    base.changeStrategy('POSTGRES');
    base.createKeyPairHelper('').createKeyPair(passphrase).then(keyPair => {
        console.log("PublicKey:" + keyPair.publicKey);
        console.log("PrivateKey:" + keyPair.privateKey);
        //check for existence or create a new account using registration
        base.accountManager.checkAccount(passphrase, "somemessage").then(account => {
            console.log("\nAccount created:" + JSON.stringify(account));
            let data = new Map();
            data.set("firstname", "John");
            data.set("lastname", "Doe");
            data.set("email", "john.doe@gmail.com");
            data.set("city", "NewYork");
            base.profileManager.updateData(data).then(encryptedData => {
                console.log("\nUser data is encrypted and saved to Base.");
                for (var [key, value] of encryptedData.entries()) {
                    console.log("Key:" + key + ", Encrypted Value:" + value);
                }
                base.profileManager.getData().then(decryptedData => {
                    console.log("\nUser data is retrieved from Base and decrypted.");
                    for (var [key, value] of decryptedData.entries()) {
                        console.log("Key:" + key + ", Decrypted Value:" + value);
                    }
                }).catch(e => {
                    console.log(e);
                });
            }).catch(e => {
                console.log(e);
            });
        }).catch(e => {
            console.log(e);
        });
    });
}

demo();