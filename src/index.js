'use strict';

import Base from "@bitclave/base-client-js";
import { CompareAction, Offer } from "@bitclave/base-client-js";

//required for babel to polyfill regeneratorRuntime
require("babel-polyfill");

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

(async function() {
    //Define a passphrase
    const passphrase = 'some passphrase';
    
    //Initialize Base
    const base = new Base("https://base2-bitclva-com.herokuapp.com", 'localhost', '', '');
    base.changeStrategy('POSTGRES');
    
    //Create a KeyPair
    let keyPair = await base.createKeyPairHelper('').createKeyPair(passphrase);

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

    let searchRequestTags = new Map();
    searchRequestTags.set("type", "car");

    let compareMap = new Map();
    compareMap.set("age", "25");

    let rulesMap = new Map();
    rulesMap.set("age", CompareAction.EQUALLY.toString());
    
    let offer = new Offer('somew description', 'some title', 'some imageUrl', 1,
            searchRequestTags, compareMap, rulesMap);

    try {
        //let savedSearchRequest = await baseAlice.searchManager.createRequest(new SearchRequest(searchRequestTags));
        let savedOffer = await base.offerManager.saveOffer(offer);
    } catch(e) {
        console.log("Something wrong in before", e);
        assert.fail("Something wrong in before");
    }
})();
