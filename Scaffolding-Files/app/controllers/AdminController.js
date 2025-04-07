const { Administrator } = require('../models/Administrator'); // Import the Administrator model

// Admin controller class
class AdminController {

    // Admin Dashboard - List all tasks
    static async adminDashboard(req, res) {
        const adminTasks = [
            {
                id: 'verify-new-users',
                title: 'Manage Users'
            },
            {
                id: 'inspect-items',
                title: 'Inspect Items'
            },
            {
                id: 'monitor-listings',
                title: 'Monitor Listings'
            },
            {
                id: 'resolve-disputes',
                title: 'Resolve Disputes'
            }
        ];

        res.render("admin", { title: 'Admin Dashboard', adminTasks });
    }

    // Verify New Users
    static async verifyNewUsers(req, res) {
        const admin = new Administrator(); // Create an admin instance
        try {
            const users = await admin.getAllUsers(); // Fetch all users
            res.render("admin/verify-new-users", { title: 'Verify New Users', users });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Error occurred while fetching users.");
        }
    }
    
    static async removeUser(req, res) {
        const userId = req.params.id; // Get the user ID from the request
        const admin = new Administrator(); // Create an admin instance
        try {
            await admin.removeUser(userId); // Remove the user
            res.redirect("/admin/verify-new-users"); // Redirect back to the verify users page
        } catch (error) {
            console.error("Error removing user:", error);
            res.status(500).send("Error occurred while removing user.");
        }
    }

    // Inspect Items
    static async inspectItems(req, res) {
        const admin = new Administrator(); // Create an admin instance
        try {
            const itemsToInspect = await admin.getItemsToInspect(); // Fetch items pending inspection
            res.render("admin/inspect-items", { title: 'Inspect Items', items: itemsToInspect });
        } catch (error) {
            console.error("Error inspecting items:", error);
            res.status(500).send("Error occurred while inspecting items.");
        }
    }

    // Monitor Listings
    static async monitorListings(req, res) {
        const admin = new Administrator(); // Create an admin instance
        try {
            const outfits = await admin.getAllOutfits(); // Fetch all outfits
            res.render("admin/monitor-listings", { title: 'Monitor Listings', outfits });
        } catch (error) {
            console.error("Error fetching outfits:", error);
            res.status(500).send("Error occurred while fetching outfits.");
        }
    }
    
    static async removeOutfit(req, res) {
        const outfitId = req.params.id; // Get the outfit ID from the request
        const admin = new Administrator(); // Create an admin instance
        try {
            await admin.removeOutfit(outfitId); // Remove the outfit
            res.redirect("/admin/monitor-listings"); // Redirect back to the monitor listings page
        } catch (error) {
            console.error("Error removing outfit:", error);
            res.status(500).send("Error occurred while removing outfit.");
        }
    }

    // Resolve Disputes
    static async resolveDisputes(req, res) {
        const admin = new Administrator(); // Create an admin instance
        try {
            const disputes = await admin.getAllDisputes(); // Fetch all disputes
            res.render("admin/resolve-disputes", { title: 'Resolve Disputes', disputes });
        } catch (error) {
            console.error("Error fetching disputes:", error);
            res.status(500).send("Error occurred while fetching disputes.");
        }
    }
    
    static async resolveDispute(req, res) {
        const disputeId = req.params.id; // Get the dispute ID from the request
        const admin = new Administrator(); // Create an admin instance
        try {
            await admin.resolveDispute(disputeId); // Resolve the dispute
            res.redirect("/admin/resolve-disputes"); // Redirect back to the disputes page
        } catch (error) {
            console.error("Error resolving dispute:", error);
            res.status(500).send("Error occurred while resolving dispute.");
        }
    }
}

module.exports = AdminController;
