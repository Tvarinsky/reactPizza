'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async createOrder(ctx){
        const orderDetails = []

        let totalPrice = [];

        if ( ctx.request.body.discount ) {
            for (const item of ctx.request.body.cartItems){
                totalPrice.push(Math.round((item.count * item.price) - (item.count * item.price / 100 * ctx.request.body.discount)))
            }

            totalPrice = totalPrice.reduce((a, b) => a + b);
        } else {
            for (const item of ctx.request.body.cartItems){
                totalPrice.push(Math.round((item.count * item.price)))
            }

            totalPrice = totalPrice.reduce((a, b) => a + b);
        }

        let total = 0;

        for (const item of ctx.request.body.cartItems){
            let product = await strapi.query('child').findOne({childName: item.title})
            if (!product){
				return ctx.status = 404
			}
			else{
				total += parseInt(product.price) * parseInt(item.quantity)
			}

			orderDetails.push({
				__component: "order-products.products",
				quantity: item.count,
                total: item.count * item.price,
                children: [product.id],
                toppings: item.topping.join(', ')
			})
        }

        await strapi.query('orders').create({
            name: ctx.request.body.values.name,
            phone: ctx.request.body.values.phone,
            street: ctx.request.body.values.street,
            appartment: ctx.request.body.values.appartment,
            entrance: ctx.request.body.values.entrance,
            intercom: ctx.request.body.values.intercom,
            floor: ctx.request.body.values.floor,
            house: ctx.request.body.values.house,
            comment: ctx.request.body.values.comment,
            order_details: orderDetails,
            orderTotal: totalPrice
        })
        
        return ctx.status = 200
    }
};

