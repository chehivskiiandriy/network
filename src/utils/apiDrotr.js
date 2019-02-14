import axios from './axiosDrotr';

export default {
  regEmail: (data, config) =>
    axios.post('v1/drotr/auth/reg-email', data, config),
  regPhone: (data, config) =>
    axios.post('v1/drotr/auth/reg-phone', data, config),
  confirmPhone: (data, config) =>
    axios.post('v1/drotr/auth/confirm-phone', data, config)
}
