class IUserManagement{

    buy(){
        throw new Error('Method "buy" must be implemented');
    }
    sell(){
        throw new Error('Method "sell" must be implemented');
    }
    addOutfit(){
        throw new Error('Method "addOutfit" must be implemented');
    }
    writeReview(){
        throw new Error('Method "writeReview" must be implemented');
    }
    
    // there will be a payment method as a mitigation to miscuonduct and damages.
    addPaymentMethod(){
        throw new Error('Method "writeReview" must be implemented');
    }

    updatePaymentMethod(){
        throw new Error('Method "writeReview" must be implemented');
    }

    // note a payment method whould only be removed if the use is updating

    removePaymentMethod(){
        throw new Error('Method "writeReview" must be implemented');
    }

}
export default IUserManagement;