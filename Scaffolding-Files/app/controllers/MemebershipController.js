const Membership = require('../models/Membership').Membership;

exports.getMembership= async (req, res) => {
    try {
        const {membershipId} = req.params;
        const membershipInstance = new Membership(membershipId, null, null, null, null, null);
        const membershipDetails = await membershipInstance.getMembershipDetails();

        if (membershipDetails) {
            res.json(membershipDetails);
        } else {
            res.status(404).json({message: "Membership not found"})
        }
    } catch (error) {
        console.error("Error getting membership:", error);
        res.status(500).send(error.toString());
    }
};