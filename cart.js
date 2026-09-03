/* =========================
   CART STORAGE HELPERS
========================= */

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(c => c.id === item.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    saveCart(cart);
    showToast(`${item.name} added to cart`);
}

function removeFromCart(id) {
    const cart = getCart().filter(c => c.id !== id);
    saveCart(cart);
}

function updateQty(id, qty) {
    const cart = getCart();
    const item = cart.find(c => c.id === id);

    if (!item) return;

    if (qty <= 0) {
        removeFromCart(id);
        return;
    }

    item.qty = qty;
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}


/* =========================
   CART BADGE (nav icon)
========================= */

function updateCartCount() {
    const badge = document.getElementById("cartCount");

    if (badge) {
        const count = getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }

    updateMiniCartBar();
}


/* =========================
   FLOATING MINI ORDER BAR
   (hidden on the checkout page itself)
========================= */

function updateMiniCartBar() {

    if (window.location.pathname.includes("order.html")) {
        return;
    }

    const count = getCartCount();
    const total = getCartTotal();

    let bar = document.getElementById("miniCartBar");

    if (count === 0) {
        if (bar) bar.classList.remove("show");
        return;
    }

    if (!bar) {
        bar = document.createElement("div");
        bar.id = "miniCartBar";
        bar.innerHTML = `
            <span id="miniCartText"></span>
            <a href="order.html" class="mini-cart-btn">View Order</a>
        `;
        document.body.appendChild(bar);
    }

    document.getElementById("miniCartText").textContent =
        `${count} item${count > 1 ? "s" : ""} · ₦${total.toLocaleString()}`;

    bar.classList.add("show");
}


/* =========================
   TOAST NOTIFICATION
========================= */

function showToast(message) {
    let toast = document.getElementById("cartToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "cartToast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toast.hideTimer);
    toast.hideTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}


document.addEventListener("DOMContentLoaded", updateCartCount);


/* =========================
   ADD TO CART — shared click handler
   Works for any "Order" button on any page
   that carries data-id / data-name / data-price / data-image
========================= */

document.addEventListener("click", function (e) {

    const btn = e.target.closest(".add-to-cart-btn");

    if (!btn) return;

    addToCart({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: Number(btn.dataset.price),
        image: btn.dataset.image
    });

});