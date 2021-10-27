const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, { allowedTags: [], allowrdAttributes: {}, });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.localSchema = Joi.object({
    local: Joi.object({
        nome: Joi.string().required().escapeHTML(),
        doadores: Joi.number().required().min(0),
        // imagem: Joi.string().required(),
        endereco: Joi.string().required().escapeHTML(),
        descricao: Joi.string().required().escapeHTML()


    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required().escapeHTML()
    }).required()
})