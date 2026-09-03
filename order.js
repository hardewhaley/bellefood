document.addEventListener("DOMContentLoaded", function () {

    const cartItemsEl = document.getElementById("cartItems");
    const emptyMessage = document.getElementById("emptyCartMessage");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("cartTotal");
    const deliveryFee = 1000;

    const checkoutForm = document.getElementById("checkoutForm");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const whatsappBtn = document.getElementById("whatsappOrderBtn");
    const orderModal = document.getElementById("orderModal");

    // Replace with your actual WhatsApp business number (with country code, no + or spaces)
    const whatsappNumber = "2348154335354";


    function formatNaira(amount) {
        return "₦" + amount.toLocaleString();
    }


    function renderCart() {

        const cart = getCart();

        if (cart.length === 0) {
            cartItemsEl.innerHTML = "";
            emptyMessage.style.display = "block";
            placeOrderBtn.disabled = true;
            whatsappBtn.disabled = true;
        } else {
            emptyMessage.style.display = "none";
            placeOrderBtn.disabled = false;
            whatsappBtn.disabled = false;

            cartItemsEl.innerHTML = `
                <div class="table-wrapper">
                    <table class="cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cart.map(item => `
                                <tr>
                                    <td class="cart-product" data-label="Product">
                                        <img src="${item.image}" alt="${item.name}">
                                        <span>${item.name}</span>
                                    </td>

                                    <td data-label="Price">${formatNaira(item.price)}</td>

                                    <td data-label="Quantity">
                                        <div class="qty-controls">
                                            <button class="qty-btn" data-id="${item.id}" data-action="decrease">-</button>
                                            <span>${item.qty}</span>
                                            <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
                                        </div>
                                    </td>

                                    <td class="cart-item-total" data-label="Total">${formatNaira(item.price * item.qty)}</td>

                                    <td data-label="Remove">
                                        <button class="remove-item" data-id="${item.id}">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        }

        const subtotal = getCartTotal();
        const total = cart.length ? subtotal + deliveryFee : 0;

        subtotalEl.textContent = formatNaira(subtotal);
        totalEl.textContent = formatNaira(total);
    }


    /* Qty +/- and remove — event delegation */

    cartItemsEl.addEventListener("click", function (e) {

        const qtyBtn = e.target.closest(".qty-btn");
        const removeBtn = e.target.closest(".remove-item");

        if (qtyBtn) {

            const id = qtyBtn.dataset.id;
            const cart = getCart();
            const item = cart.find(c => c.id === id);

            if (!item) return;

            const newQty = qtyBtn.dataset.action === "increase"
                ? item.qty + 1
                : item.qty - 1;

            updateQty(id, newQty);
            renderCart();
        }

        if (removeBtn) {
            removeFromCart(removeBtn.dataset.id);
            renderCart();
        }

    });


    // Replace with your own Formspree form endpoint (see formspree.io)
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";


    /* Checkout submit — actually sends the order to you via email */

    checkoutForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const cart = getCart();

        if (cart.length === 0) {
            return;
        }

        const subtotal = getCartTotal();
        const total = subtotal + deliveryFee;

        // Build a readable order summary to include with the email
        let orderSummary = "";

        cart.forEach(item => {
            orderSummary += `${item.qty} x ${item.name} - ${formatNaira(item.price * item.qty)}\n`;
        });

        orderSummary += `\nSubtotal: ${formatNaira(subtotal)}`;
        orderSummary += `\nDelivery Fee: ${formatNaira(deliveryFee)}`;
        orderSummary += `\nTotal: ${formatNaira(total)}`;

        const formData = new FormData(checkoutForm);
        formData.append("Order Summary", orderSummary);

        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = "Placing Order...";

        fetch(FORMSPREE_ENDPOINT, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        })
            .then(response => {

                if (response.ok) {
                    clearCart();
                    renderCart();
                    checkoutForm.reset();
                    orderModal.classList.add("show");
                } else {
                    alert("Something went wrong sending your order. Please try the WhatsApp option instead.");
                }

            })
            .catch(() => {
                alert("Network error. Please check your connection, or use the WhatsApp option to place your order.");
            })
            .finally(() => {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = "Place Order";
            });

    });


    /* Place order via WhatsApp */

    whatsappBtn.addEventListener("click", function () {

        const cart = getCart();

        if (cart.length === 0) {
            return;
        }

        // Reuse the form's own required-field validation
        if (!checkoutForm.reportValidity()) {
            return;
        }

        const name = document.getElementById("fullName").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
        const payment = document.getElementById("payment").value;
        const notes = document.getElementById("notes").value;

        const subtotal = getCartTotal();
        const total = subtotal + deliveryFee;

        let message = "New Order - BelleFoods\n\n";
        message += "Items:\n";

        cart.forEach(item => {
            message += `${item.qty} x ${item.name} - ${formatNaira(item.price * item.qty)}\n`;
        });

        message += `\nSubtotal: ${formatNaira(subtotal)}`;
        message += `\nDelivery Fee: ${formatNaira(deliveryFee)}`;
        message += `\nTotal: ${formatNaira(total)}`;

        message += "\n\nCustomer Details";
        message += `\nName: ${name}`;
        message += `\nPhone: ${phone}`;
        message += `\nAddress: ${address}`;
        message += `\nPayment: ${payment}`;

        if (notes) {
            message += `\nNotes: ${notes}`;
        }

        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");

    });


    renderCart();

});