/**
Observe custom contacts

@method observeCustomContracts
*/
observeCustomContracts = function(){

    /**
    Observe custom contracts, listen for new created tokens.

    @class CustomContracts({}).observe
    @constructor
    */
    collectionObservers[collectionObservers.length] = CustomContracts.find({}).observe({
        /**
        Will check if the contracts are on the current chain

        @method added
        */
        added: function(newDocument) {
            // check if wallet has code
            web3.eth.getCode(newDocument.address, function(e, code) {
                if(!e && code && code.length > 2 ){
                    CustomContracts.update(newDocument._id, {$unset: {
                        disabled: false
                    }});

                    // check for logs
                    // addLogWatching(newDocument);
                    
                } else if (!e) {
                    // if there's no code, check the contract has a balance
                    web3.eth.getBalance(newDocument.address, function(e, balance) {
                        if(!e && balance.gt(0)){
                            CustomContracts.update(newDocument._id, {$unset: {
                                disabled: false
                            }});

                            // check for logs
                            // addLogWatching(newDocument);                        

                        } else if (!e) {
                            CustomContracts.update(newDocument._id, {$set: {
                                disabled: true
                            }});
                        } 
                    });                        
                }
            });
        }
    });
}