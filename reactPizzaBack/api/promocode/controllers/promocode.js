'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async checkPromocode(ctx) {
        let promocodeCheck
        
        promocodeCheck = await strapi.query('promocode').findOne({promocode: ctx.request.body.promo})

        if(!promocodeCheck) {
            return ctx.status = 404
        }
        else {
            if (promocodeCheck.type == 'discount' && promocodeCheck.usesRemain > 0) {
                ctx.body = {
                    value: promocodeCheck
                }

                strapi.query('promocode').update({id: promocodeCheck.id}, {
                    usesRemain: parseInt(promocodeCheck.usesRemain) - 1
                })

                return ctx.status = 200
            }

            if (promocodeCheck.type == 'freeproduct' && promocodeCheck.usesRemain > 0) {
                ctx.body = {
                    value: promocodeCheck
                }
                
                strapi.query('promocode').update({id: promocodeCheck.id}, {
                    usesRemain: parseInt(promocodeCheck.usesRemain) - 1
                })

                return ctx.status = 200
            }
        }

    }
};
