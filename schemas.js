// tool of back-end validation(npm i joi)
const Joi = require('joi');

module.exports.tenniscourtSchema = Joi.object({
    tenniscourt: Joi.object({
        name: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
        courtNum: Joi.number().required().integer().min(1),
        image: Joi.string().optional().allow(''),
        latitude: Joi.number().optional().allow(''),
        longitude: Joi.number().optional().allow(''),
        startTime: Joi.string(),
        endTime: Joi.string(),
        light: Joi.string()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});