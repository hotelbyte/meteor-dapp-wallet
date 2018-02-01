
/**
The walletConnector

@class walletConnector
@constructor
*/

/**
Contains all wallet contracts

@property contracts
*/
contracts = {};


/**
Contains all collection observers

@property collectionObservers
*/
collectionObservers = [];


/**
Config for the hotelbyte connector

@property config
*/
hotelbyteConfig = {
    /**
    Number of blocks to rollback, from the last checkpoint block of the wallet.

    @property hotelbyteConfig.rollBackBy
    */
    rollBackBy: 0,
    /**
    Number of blocks to confirm a wallet

    @property hotelbyteConfig.requiredConfirmations
    */
    requiredConfirmations: 12,
    /**
    The default daily limit used for simple accounts

    @property hotelbyteConfig.dailyLimitDefault
    */
    dailyLimitDefault: '100000000000000000000000000'
};


/**
Connects to a node and setup all the filters for the accounts.

@method connectToNode
*/
connectToNode = function(){

    console.time('startNode')
    console.log('Connect to node...');

    EthAccounts.init();
    EthBlocks.init();
    EthTools.ticker.start({
      extraParams: (typeof dhi !== 'undefined') ? 'DHI-'+ dhi.version : '',
      currencies: ['BTC', 'USD', 'EUR', 'BRL', 'GBP']
    });

    if (EthAccounts.find().count() > 0) {
        checkForOriginalWallet();
    }

    observeLatestBlocks();

    observeWallets();

    observeTransactions();

    observeEvents();

    observeTokens();

    observePendingConfirmations();

    observeCustomContracts();

    console.timeEnd('startNode')
};

/**
Will remove all transactions, and will set the checkpointBlock to the creationBlock in the wallets

@method connectToNode
*/
resetWallet = function function_name (argument) {
    _.each(Transactions.find().fetch(), function(tx) {
        console.log(tx._id);
        try {
            Transactions.remove(tx._id);
        } catch(e){
            console.error(e);
        }
    });

    _.each(PendingConfirmations.find().fetch(), function(pc) {
        try {
            PendingConfirmations.remove(pc._id);
        } catch(e){
            console.error(e);
        }
    });

    _.each(Wallets.find().fetch(), function(wallet) {
        Wallets.update(wallet._id, {$set: {
            checkpointBlock: wallet.creationBlock,
            transactions: []
        }});
    });

    web3.reset();
    console.log('The wallet will re-fetch log information in 6 seconds...');

    setTimeout(function() {
        console.log('Fetching logs...');
        connectToNode();
    }, 1000 * 6);
}
