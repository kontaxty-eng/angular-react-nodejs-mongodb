const AppError = require('../../application/errors/AppError');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      throw new AppError(errors.join(', '), 400);
    }
    
    req.body = value; // Use sanitized/validated data
    next();
  };
};

module.exports = validate;
