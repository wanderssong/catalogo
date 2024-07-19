document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product');
    const productModal = document.getElementById('product-modal');
    const cartModal = document.getElementById('cart-modal');
    const cartButton = document.getElementById('cart-button');
    const cartItems = document.getElementById('cart-items');
    const carouselContainer = productModal.querySelector('.carousel');
    const carouselImages = productModal.querySelectorAll('.carousel-img');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const addToCartButton = document.getElementById('add-to-cart');
    const paymentMethod = document.getElementById('payment-method');
    const cashChange = document.getElementById('cash-change');
    const notification = document.getElementById('notification');
    const cartCounter = document.getElementById('cart-counter');
    let cart = [];
    let selectedProduct = null;

    products.forEach(product => {
        product.querySelector('img').addEventListener('click', () => {
            selectedProduct = {
                id: product.dataset.id,
                images: [
                    product.querySelector('img').src,
                    product.dataset.image2,
                    product.dataset.image3
                ],
                desc: product.querySelector('p').textContent,
                price: product.dataset.price
            };
            updateModal(selectedProduct);
            productModal.style.display = 'block';
        });

        product.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            const productToAdd = {
                id: product.dataset.id,
                images: [
                    product.querySelector('img').src,
                    product.dataset.image2,
                    product.dataset.image3
                ],
                desc: product.querySelector('p').textContent,
                price: product.dataset.price
            };
            cart.push(productToAdd);
            updateCart();
            showNotification('Produto adicionado ao carrinho');
        });
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            productModal.style.display = 'none';
            cartModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    addToCartButton.addEventListener('click', () => {
        if (selectedProduct) {
            cart.push(selectedProduct);
            updateCart();
            productModal.style.display = 'none';
            showNotification('Produto adicionado ao carrinho');
        }
    });

    cartButton.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    paymentMethod.addEventListener('change', () => {
        if (paymentMethod.value === 'Dinheiro') {
            cashChange.style.display = 'block';
        } else {
            cashChange.style.display = 'none';
        }
    });

    document.getElementById('payment-method').addEventListener('change', function() {
        var paymentMethod = this.value;
        var installmentsDiv = document.getElementById('installments');
        var cashChangeDiv = document.getElementById('cash-change');
        
        if (paymentMethod === 'Cartão de Crédito') {
            installmentsDiv.style.display = 'block';
            cashChangeDiv.style.display = 'none';
        } else if (paymentMethod === 'Dinheiro') {
            installmentsDiv.style.display = 'none';
            cashChangeDiv.style.display = 'block';
        } else {
            installmentsDiv.style.display = 'none';
            cashChangeDiv.style.display = 'none';
        }
    });

    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        sendOrderToWhatsApp();
    });

    function updateModal(product) {
        carouselImages.forEach((img, index) => {
            img.src = product.images[index] || '';
            img.style.display = product.images[index] ? 'block' : 'none';
        });
        modalDesc.textContent = product.desc;
        modalPrice.textContent = `Preço: R$${product.price}`;
        showSlide(0);
    }

    let currentSlide = 0;

    function showSlide(index) {
        const totalSlides = carouselImages.length;
        currentSlide = (index + totalSlides) % totalSlides;
        carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    document.querySelector('.prev').addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });

    document.querySelector('.next').addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += parseFloat(item.price);
            const itemElem = document.createElement('div');
            itemElem.classList.add('cart-item');
    
            const itemInfo = document.createElement('span');
            itemInfo.textContent = `${item.desc} - R$${item.price}`;
            itemElem.appendChild(itemInfo);
    
            const deleteIcon = document.createElement('span');
            deleteIcon.innerHTML = '&#10005;'; // ícone "X"
            deleteIcon.classList.add('delete-icon');
            deleteIcon.addEventListener('click', () => {
                removeFromCart(index);
            });
            itemElem.appendChild(deleteIcon);
    
            cartItems.appendChild(itemElem);
        });
    
        const totalElem = document.createElement('div');
        totalElem.textContent = `Total: R$${total.toFixed(2)}`;
        totalElem.classList.add('total');
        cartItems.appendChild(totalElem);
    
        cartCounter.textContent = cart.length;
    }
    
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    function sendOrderToWhatsApp() {
        const name = document.getElementById('customer-name').value;
        const address = document.getElementById('customer-address').value;
        const payment = paymentMethod.value;
        const installments = document.getElementById('installment-options').value;
        let message = `Detalhes do pedido:\nNome: ${name}\nEndereço: ${address}\nMétodo de pagamento: ${payment}`;
        
        if (payment === 'Cartão de Crédito') {
            message += ` em ${installments}`;
        }
        
        message += `\nItens:\n`;
        cart.forEach(item => {
            message += `${item.desc} - R$${item.price}\n`;
        });
        message += `Total: R$${cart.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2)}\n`;
        
        if (payment === 'Dinheiro') {
            const changeFor = document.getElementById('change-for').value;
            message += `Troco para: R$${changeFor}\n`;
        }
        
        const whatsappUrl = `https://wa.me/5566996967406?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});