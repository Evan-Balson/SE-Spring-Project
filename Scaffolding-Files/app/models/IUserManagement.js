class IUserManagement{

    buy(outfitId){
        throw new Error('Method "buy" must be implemented');
    }
    sell(outfitName, outfitColor, outfitSize, outfitDescription, itemCondition, categoryIds){
        throw new Error('Method "sell" must be implemented');
    }

    writeReview(outfitId, rating, comment){
        throw new Error('Method "writeReview" must be implemented');
    }
    
    // there will be a payment method as a mitigation to miscuonduct and damages.
    addPaymentMethod(paymentDetails){
        throw new Error('Method "writeReview" must be implemented');
    }

    updatePaymentMethod(paymentId, updatedDetails){
        throw new Error('Method "writeReview" must be implemented');
    }

    // note a payment method whould only be removed if the use is updating

    removePaymentMethod(paymentID){
        throw new Error('Method "writeReview" must be implemented');
    }

}
export default IUserManagement;