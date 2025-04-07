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
                title: '0 Disputes Pending. View Disputes'
            }
        ];

        res.render("admin", { title: 'Admin Dashboard', adminTasks });
    }

    // Verify New Users
    static async verifyNewUsers(req, res) {
        const admin = new Administrator(); // Create an admin instance
        try {
            const usersToVerify = await admin.verifyUser(); // Fetch users pending verification
            res.render("admin/verify-new-users", { title: 'Verify New Users', users: usersToVerify });
        } catch (error) {
            console.error("Error fetching users to verify:", error);
            res.status(500).send("Error occurred while fetching users to verify.");
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
            const listings = await admin.monitorListingActivity(); // Fetch listing activities
            res.render("admin/monitor-listings", { title: 'Monitor Listings', listings });
        } catch (error) {
            console.error("Error monitoring listings:", error);
            res.status(500).send("Error occurred while monitoring listings.");
        }
    }

    // Resolve Disputes
    static async resolveDisputes(req, res) {
        const admin = new Administrator(); // Create an admin instance
        try {
            const disputes = await admin.resolveDisputes(); // Fetch disputes pending resolution
            res.render("admin/resolve-disputes", { title: 'Resolve Disputes', disputes });
        } catch (error) {
            console.error("Error resolving disputes:", error);
            res.status(500).send("Error occurred while resolving disputes.");
        }
    }
}

module.exports = AdminController;
