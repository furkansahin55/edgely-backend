const Joi = require('joi');

const createAlert = {
  body: Joi.object()
    .required()
    .keys({
      data: Joi.object()
        .required()
        .keys({
          name: Joi.string().max(42).required(),
          type_id: Joi.number().max(10).required(),
          arguments: Joi.object()
            .required()
            .keys({
              address: Joi.string().length(42).required(),
              price: Joi.number(),
              condition: Joi.string().valid('above', 'below'),
            }),
          delivery_channel_id: Joi.number().max(5).required(),
          delivery_arguments: Joi.object().required().keys({ id: Joi.string().required() }),
          active: Joi.boolean().required(),
        }),
    }),
};

const updateAlert = {
  body: Joi.object()
    .required()
    .keys({
      data: Joi.object()
        .required()
        .keys({
          id: Joi.number().required(),
          name: Joi.string().max(42),
          type_id: Joi.number().max(10),
          arguments: Joi.object().keys({
            address: Joi.string().length(42).required(),
            price: Joi.number(),
            condition: Joi.string().valid('above', 'below'),
          }),
          delivery_channel_id: Joi.number().max(5),
          delivery_arguments: Joi.object().keys({ id: Joi.string().required() }),
          active: Joi.boolean(),
        }),
    }),
};

const deleteAlert = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

module.exports = {
  createAlert,
  updateAlert,
  deleteAlert,
};
