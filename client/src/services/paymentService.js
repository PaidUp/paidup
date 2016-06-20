'use strict'

module.exports = ['$resource', function ($resource) {
  var Payment = $resource('/api/v1/commerce/checkout/place', {}, {})
  var BankPayment = $resource('/api/v1/payment/bank/:action', {}, {})
  var ListBanks = $resource('/api/v1/payment/bank/list/user/:userId', {}, {})
  var DeleteBank = $resource('/api/v1/payment/bank/delete/:customerId/:bankId', {}, {})
  var CardPayment = $resource('/api/v1/payment/card/:action', {}, {})
  var ListCards = $resource('/api/v1/payment/card/list/user/:userId', {}, {})
  var CustomerPayment = $resource('/api/v1/payment/customer/:action', {}, {})
  var calculateDuesPost = $resource('/api/v1/commerce/dues/calculate', {}, {})
  var transfer = $resource('/api/v1/payment/transfer/:organizationId', {}, {})
  var balance = $resource('/api/v1/payment/balance/:organizationId', {}, {})

  var discount = $resource('/api/v1/commerce/cart/coupon/add', {}, {
    apply: {
      method: 'POST',
      isArray: false
    }
  })

  var brands = {
    'Visa': 'cc-visa',
    'MasterCard': 'cc-mastercard',
    'American Express': 'cc-amex',
    'Discover': 'cc-discover',
    'Diners Club': 'cc-diners-club',
    'JCB': 'cc-jcb'
  }

  this.getBrandCardClass = function (stripeBrand) {
    return brands[stripeBrand] || 'fa-credit-card'
  }

  this.sendPayment = function (payment) {
    return Payment.save(payment).$promise
  }

  this.associateBankPayment = function (data) {
    return BankPayment.save({ action: 'associate' }, data).$promise
  }

  this.listBankAccounts = function (userId) {
    if (userId) {
      return ListBanks.get({ userId: userId }).$promise
    }

    return BankPayment.get({ action: 'list' }).$promise
  }

  this.hasBankAccountsWihtoutVerify = function (cb) {
    this.listBankAccounts().then(function (bankAccounts) {
      if (bankAccounts && bankAccounts.data) {
        bankAccounts.data.forEach(function (ele) {
          if (ele.status === 'new') {
            return cb(true)
          }
        })
      }
      cb(false)
    }).catch(function (err) {
      console.log('err', err)
      cb(false)
    })
  }

  this.getBankAccount = function (bankId) {
    return BankPayment.get({ action: bankId }).$promise
  }

  this.deleteBankAccount = function (customerId, bankId) {
    return DeleteBank.get({ customerId: customerId, bankId: bankId }).$promise
  }

  this.verifyBankAccount = function (bankInfo) {
    return BankPayment.save({ action: 'verify' }, bankInfo).$promise
  }

  this.listCards = function (userId) {
    if (userId) {
      return ListCards.get({ userId: userId }).$promise
    }
    return CardPayment.get({ action: 'list' }).$promise
  }

  this.getCard = function (cardId) {
    return CardPayment.get({ action: cardId }).$promise
  }

  var CardService = $resource('/api/v1/payment/card/associate', {}, {})
  this.associateCard = function (cardId) {
    return CardService.save({ cardId: cardId }).$promise
  }

  this.updateCustomer = function (dataCustomer) {
    return CustomerPayment.save({ action: 'update' }, dataCustomer).$promise
  }

  this.calculateDues = function (params, cb) {
    calculateDuesPost.save(null, { prices: params }).$promise.then(function (data) {
      cb(null, data.body)
    }).catch(function (err) {
      cb(err)
    })
  }

  this.applyDiscount = function (productId, coupon, cb) {
    discount.apply({
      coupon: coupon,
      productId: productId
    }).$promise.then(function (result) {
      cb(null, result)
    }).catch(function (err) {
      console.log(err)
      cb(err)
    })
  }

  this.getTransfers = function (organizationId) {
    return transfer.get({ organizationId: organizationId }).$promise
  }

  this.getBalance = function (organizationId) {
    return balance.get({ organizationId: organizationId }).$promise
  }
}]
