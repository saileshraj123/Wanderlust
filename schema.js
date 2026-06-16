// const Joi = require('joi');
// module.export.listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string.required(),
//         description: Joi.string.required(),
//         location: Joi.string.required(),
//         price: Joi.number.required().min(0),
//         image: Joi.object({
//             url: Joi.string().allow("", null)
//         }),
//         country: Joi.string.required(),
//     })
// }).required()


const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),

        description: Joi.string().required(),

        location: Joi.string().required(),

        price: Joi.number().required().min(0),

        // image: Joi.object({
        //     url: Joi.string().allow("", null)
        // }),

        image: Joi.string().allow("", null),
        country: Joi.string().required(),
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
})