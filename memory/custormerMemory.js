const customers = {};

function getCustomer(phone) {

  if (!customers[phone]) {
    customers[phone] = {
      phone,
      state: null,
      lastOrder: null
    };
  }

  return customers[phone];
}

function updateState(phone, state) {
  customers[phone].state = state;
}

function saveOrder(phone, order) {
  customers[phone].lastOrder = order;
}

export default {
  getCustomer,
  updateState,
  saveOrder
};