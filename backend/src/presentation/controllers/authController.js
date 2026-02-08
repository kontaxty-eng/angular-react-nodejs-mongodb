const authService = require('../../application/services/authService');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body?.email, req.body?.password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body?.email, req.body?.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const [type, token] = auth.split(' ');
    const bearerToken = type === 'Bearer' ? token : null;
    const result = await authService.getProfile(bearerToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  me
};
