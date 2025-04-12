const db = require('../services/db'); // If your service needs direct DB access

class Delivery {
    // Static delivery rates
    static deliveryRates = {
        'Standard Delivery': 3.56,
        'Express Delivery': 5.84,
        'Next Day Delivery': 7.99
    };

    // Get the delivery cost based on selected option
    static getDeliveryCost(option) {
        return this.deliveryRates[option] ?? this.deliveryRates['Standard Delivery']; // Fallback to standard rate
    }

    // Validate email format
    static validateEmail(email) {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate phone number (11 digits)
    static validatePhone(phone) {
        if (!phone) return false;
        const phoneRegex = /^\d+$/;
        return phoneRegex.test(phone);
    }

    // Validate UK postcode (basic format check)
    static validatePostcode(postcode) {
        if (!postcode) return false;
        const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
        return postcodeRegex.test(postcode);
    }

    // You can add other delivery-related service methods here if needed
    // For example, methods to fetch delivery options from the database, etc.
}

module.exports = Delivery;