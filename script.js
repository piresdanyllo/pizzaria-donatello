const dom = (e) => document.querySelector(e)
const domAll = (e) => document.querySelectorAll(e)
let modalQtd = 1
let modalKey = 0
let cart = []

//Listagem das pizzas
pizzaJson.map((pizza, i) => {
    let pizzaItem = dom('.models .pizza-item').cloneNode(true)

    pizzaItem.setAttribute('data-key', i)
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2).replace('.', ',')}`
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img

    //Evento para listar a pizza selecionada no modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()
        modalQtd = 1
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        console.log(key)
        modalKey = key
        dom('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        dom('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        dom('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.', ',')}`
        dom('.pizzaInfo--size.selected').classList.remove('selected')
        domAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })
        dom('.pizzaBig img').src = pizza.img
        dom('.pizzaInfo--qt').innerHTML = modalQtd

        // Abrindo modal
        dom('.pizzaWindowArea').style.opacity = 0
        dom('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => {
            dom('.pizzaWindowArea').style.opacity = 1
        }, 200)
    })

    dom('.pizza-area').append(pizzaItem)
})

//Eventos do modal
function closeModal() {
    dom('.pizzaWindowArea').style.opacity = 0
    setTimeout(() => {
        dom('.pizzaWindowArea').style.display = 'none'
    }, 500)
}

domAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
})

dom('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQtd++;
    dom('.pizzaInfo--qt').innerHTML = modalQtd;
})

dom('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQtd > 1)  {
        modalQtd--;
        dom('.pizzaInfo--qt').innerHTML = modalQtd;
    }
})

domAll('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        dom('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
})

qS('.pizzaInfo--addButton').addEventListener('click', () => {
    let sizePizza = parseInt(dom('.pizzaInfo--size.selected').getAttribute('data-key'))
    let identifier = pizzaJson[modalKey].id + '@' + sizePizza
    let key = cart.findIndex((item) => item.idSize == identifier)

    if (key > -1) {
        cart[key].qtd += modalQtd
    } else {
        cart.push({
            idSize: identifier,
            id: pizzaJson[modalKey].id,
            size: sizePizza,
            qtd: modalQtd
        })
    }
    updateCart()
    closeModal()
})

function updateCart() {
    dom('.menu-openner span').innerHTML = cart.length
    if (cart.length > 0) {
        dom('aside').classList.add('show')
        dom('.cart').innerHTML = ''
        let subTotal = 0
        let desconto = 0
        let total = 0

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
            subTotal += pizzaItem.price * cart[i].qtd

            let cartItem = dom('.models .cart--item').cloneNode(true)
            let pizzaSizeName
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = "P"
                    break;
                case 1:
                    pizzaSizeName = "M"
                    break;
                case 2:
                    pizzaSizeName = "G"
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if (cart[i].qtd > 1) {
                    cart[i].qtd--
                } else {
                    cart.splice(i, 1)
                }
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                cart[i].qtd++
                updateCart()
            })
            dom('.cart').append(cartItem)
        }

        desconto = subTotal * 0.1
        total = subTotal - desconto

        dom('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2).replace('.', ',')}`
        dom('.desconto span:last-child').innerHTML = `R$ ${subTotal.toFixed(2).replace('.', ',')}`
        dom('.total span:last-child').innerHTML = `R$ ${subTotal.toFixed(2).replace('.', ',')}`
    } else {
        dom('aside').classList.remove('show')
        dom('aside').style.left = "100vw"
    }
}

dom('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        dom('aside').style.left = '0';
    }
})

dom('.menu-closer').addEventListener('click', () => {
    dom('aside').style.left = '100vw'
});