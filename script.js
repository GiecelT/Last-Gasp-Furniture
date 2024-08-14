// Declare global variables
const items = ["Chair", "Recliner", "Table", "Umbrella"]; // List of available furnitures
const prices = [25.50, 37.75, 49.95, 24.89]; // Prices for each furniture
const states = [ // List of valid U.S. state abbreviations, including D.C.
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
];

let purchasedItems = []; // Array to store purchased items
let quantities = []; // Array to store quantities of purchased items

// Ensure DOM is fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function () {
    const purchaseBtn = document.getElementById('purchaseBtn'); // Purchase button
    const invoiceElement = document.getElementById('invoice'); // Invoice display element
    const resetBtn = document.getElementById('resetBtn'); // Reset button

    // Check if the necessary elements exist before adding event listeners
    if (purchaseBtn && invoiceElement && resetBtn) {
        purchaseBtn.addEventListener('click', makePurchase); // Trigger purchase process

        // Event listener for the reset button
        resetBtn.addEventListener('click', resetPage); // Reset the page to start over
    } else {
        console.error('Required elements not found'); // Error message if elements are missing
    }
});

// Function to handle the purchase process
function makePurchase() {
    let total = 0; // Initialize the total cost
    let moreItems = true; // Flag to control the shopping loop

    // Loop to allow the user to continue adding items to their purchase
    while (moreItems) {
        let item = prompt("What item would you like to buy today: Chair, Recliner, Table, or Umbrella?").trim().toLowerCase();
        item = capitalizeFirstLetter(item); // Ensure the first letter is capitalized

        if (items.includes(item)) { // Check if the item is valid
            let index = items.indexOf(item); // Find the item's index in the array
            let quantity = parseInt(prompt(`How many ${item} would you like to buy?`)); // Get the quantity
            if (!isNaN(quantity) && quantity > 0) { // Validate the quantity
                purchasedItems.push(item); // Add the item to the purchasedItems array
                quantities.push(quantity); // Add the quantity to the quantities array
                total += prices[index] * quantity; // Update the total cost
            } else {
                alert("Invalid quantity entered. Please try again."); // Alert for invalid quantity
                continue; // Restart the loop
            }
        } else {
            alert("Item not found. Please enter Chair, Recliner, Table, or Umbrella."); // Alert for invalid item
            continue; // Restart the loop
        }

        moreItems = confirm("Continue shopping? y/n"); // Ask if the user wants to continue shopping
    }

    let state = prompt("Please enter the two-letter state abbreviation.").trim().toUpperCase(); // Get the state abbreviation
    while (!states.includes(state)) { // Validate the state abbreviation
        state = prompt("Invalid state abbreviation. Please enter the two-letter state abbreviation.").trim().toUpperCase();
    }

    let zip = parseInt(prompt("Please enter your ZIP code.")); // Get the ZIP code
    let shipping = calculateShipping(state, zip, total); // Calculate shipping cost based on state, ZIP code, and total cost
    let subTotal = total + shipping; // Calculate subtotal (item total + shipping)
    let tax = subTotal * 0.15; // Calculate tax (15% of subtotal)
    let invoiceTotal = total + tax + shipping; // Calculate final invoice total

    displayInvoice(state, total, tax, shipping, invoiceTotal, subTotal); // Display the invoice
}

// Function to calculate shipping cost based on the state, ZIP code, and total cost
function calculateShipping(state, zip, total) {
    let zone = getShippingZone(state, zip); // Determine the shipping zone based on the state and ZIP code
    if (total > 100) {
        return 0; // Free shipping for orders over $100
    }
    switch (zone) { // Return the shipping cost based on the zone
        case 1: return 0;
        case 2: return 20;
        case 3: return 30;
        case 4: return 35;
        case 5: return 45;
        case 6: return 60;
    }
}

// Function to determine the shipping zone based on the state and ZIP code
function getShippingZone(state, zip) {
    // Group states with a single zone
    if (["ME", "NH", "VT", "MA", "RI", "CT", "NY", "NJ", "PA", "DE", "MD", "VA", "WV"].includes(state)) return 1;
    if (["OH", "IN", "KY", "TN", "NC", "SC", "GA", "FL", "AL", "MS"].includes(state)) return 2;
    if (["MI", "IL", "WI", "MO", "AR", "LA", "TX", "OK"].includes(state)) return 3;
    if (["ND", "SD", "NE", "KS", "CO", "WY", "MT", "NM", "UT", "AZ"].includes(state)) return 4;
    if (["WA", "OR", "ID", "NV", "CA"].includes(state)) return 5;
    if (["AK", "HI"].includes(state)) return 6;

    // Handle states with multiple zones based on ZIP code
    if (state === "CA") {
        if (zip >= 90001 && zip <= 93599) return 5;
        if (zip >= 93600 && zip <= 96199) return 4;
    }
    if (state === "TX") {
        if (zip >= 75001 && zip <= 79999) return 3;
        if (zip >= 73301 && zip <= 73399) return 4;
    }
    if (state === "NY") {
        if (zip >= 10001 && zip <= 11999) return 1;
        if (zip >= 12000 && zip <= 14999) return 2;
    }
    if (state === "FL") {
        if (zip >= 32000 && zip <= 34999) return 2;
        if (zip >= 33000 && zip <= 33999) return 3;
    }
    if (state === "PA") {
        if (zip >= 15000 && zip <= 19699) return 2;
        if (zip >= 19700 && zip <= 19999) return 1;
    }
    if (state === "MO") {
        if (zip >= 63000 && zip <= 65899) return 4;
        if (zip >= 64000 && zip <= 65999) return 3;
    }
    if (state === "GA") {
        if (zip >= 30000 && zip <= 31999) return 2;
        if (zip >= 39900 && zip <= 39999) return 3;
    }
    if (state === "NC") {
        if (zip >= 27000 && zip <= 28999) return 2;
        if (zip >= 28900 && zip <= 28999) return 3;
    }

    // Default return for unhandled cases
    return "Unknown Zone";
}

// Function to display the invoice to the user
function displayInvoice(state, total, tax, shipping, invoiceTotal, subTotal) {
    const invoiceElement = document.getElementById('invoice'); // Invoice display element
    const purchaseContainer = document.getElementById('purchase-container'); // Container for purchase inputs
    const invoiceContainer = document.getElementById('invoice-container'); // Container for the invoice
    const resetBtn = document.getElementById('resetBtn'); // Reset button

    // Check if the necessary elements exist
    if (invoiceElement && purchaseContainer && invoiceContainer && resetBtn) {
        let invoiceHTML = `<table><tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th>Price</th></tr>`; // Start invoice table
        for (let i = 0; i < purchasedItems.length; i++) {
            let totalPrice = (quantities[i] * prices[items.indexOf(purchasedItems[i])]).toFixed(2); // Calculate total price for each item
            invoiceHTML += `<tr><td>${purchasedItems[i]}</td><td>${quantities[i]}</td><td>${prices[items.indexOf(purchasedItems[i])]}</td><td>${totalPrice}</td></tr>`;
        }        
        // Add summary rows for total, shipping, subtotal, tax, and invoice total
        invoiceHTML += `<table><tr><th style='text-align:left;'>Item Total:</th><td style='padding-left:322px;'>${total.toFixed(2)}</td></tr>`;      
        invoiceHTML += `<tr><th style='text-align:left;'>Shipping to ${state}:</th><td style='padding-left:322px;'>$${shipping.toFixed(2)}</td></tr>`;
        invoiceHTML += `<tr><th style='text-align:left;'>Subtotal:</th><td style='padding-left:322px;'>$${subTotal.toFixed(2)}</td></tr>`;
        invoiceHTML += `<tr><th style='text-align:left;'>Tax:</th><td style='padding-left:322px;'>$${tax.toFixed(2)}</td></tr>`;
        invoiceHTML += `<tr><th style='text-align:left;'>Invoice Total:</th><td style='padding-left:322px;'>$${invoiceTotal.toFixed(2)}</td></tr>`;
        invoiceHTML += `<table><br></table>`; // Close the table

        // Display the invoice and hide the purchase form
        invoiceElement.innerHTML = invoiceHTML;
        purchaseContainer.style.display = 'none';
        invoiceContainer.style.display = 'block';
        resetBtn.style.display = 'block'; // Show the reset button
    } else {
        console.error('One or more elements for displaying the invoice not found'); // Error if elements are missing
    }
}

// Function to reset the page for a new purchase
function resetPage() {
    purchasedItems = []; // Clear purchased items
    quantities = []; // Clear quantities
    document.getElementById('invoice-container').style.display = 'none'; // Hide the invoice
    document.getElementById('purchase-container').style.display = 'block'; // Show the purchase form
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1); // Capitalize first letter
}