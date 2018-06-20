'use strict';

import Base from "./lib/Bitclave-Base";
import * as os from 'os';

function demo() {
    const passphrase = 'some passphrase';
    
    const base = new Base("https://base-node-staging.herokuapp.com", 'localhost', '', '');
    base.createKeyPairHelper('').createKeyPair(passphrase).then(keyPair => {
        console.log("PublicKey:" + keyPair.publicKey);
        console.log("PrivateKey:" + keyPair.privateKey);
        //check for existence or create a new account using registration
        base.accountManager.checkAccount(passphrase, "somemessage").then(account => {
            console.log("Account created:" + JSON.stringify(account));
            let myMap = new Map();
            myMap.set("email", "im@host.com");
            base.profileManager.updateData(myMap).then(encryptedData => {
                base.profileManager.getData().then(data => {
                    console.log("user data:" + data);
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