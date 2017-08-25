'use strict'

const path = require('path')
const _ = require('lodash')

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'convenience-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/convenience-dev',
    options: {
      db: {
        safe: true
      },
      prefix: 'paidup_'
    }

  },

  zendesk: {
    username: 'ricardo@getpaidup.com',
    token: 'ALTnkNkK72Cu28uBK30p7e20FUYEDOVytF6Y5GtI',
    subdomain: 'getpaidup1478060212',
    assigneeEmail: 'felipe@getpaidup.com',
    customFields: {
      balance: "56485848"
    }
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  // Email system
  emailService: {
    service: 'gmail',
    auth: {
      user: 'convenieceselect@gmail.com',
      pass: 'N6hCa3unqTsP&w'
    }
  },

  emailTemplateRoot: path.normalize(__dirname + '/../../../server/views/email'),
  emailOptions: {
    from: 'PaidUp <ourteam@getpaidup.com>',
    subject: 'Default Subject (ourteam)'
  },
  emailOptionsAlerts: {
    from: 'PaidUp <alerts@getpaidup.com>',
    subject: 'Default Subject (alerts)'
  },
  emailVars: {
    companyName: 'GetPaidUp',
    baseUrl: 'http://localhost:9000',
    prefix: '[DEV] '
  },
  emailContacts: {
    contact: 'convenieceselect@gmail.com',
    admin: 'convenieceselect@gmail.com',
    developer: 'convenieceselect@gmail.com'
  },

  // contract data
  contractData: {
    contractTemplateRoot: path.normalize(__dirname + '/../../../server/views/loan'),
    convenienceSelect: {
      state: 'Texas',
      creditor: 'PaidUp, Inc.',
      address: '2900 North Quinlan Park Rd. Suite 240-320.',
      city: 'Austin',
      zip: '78732',
      phone: '(855) 764-3232',
      lateChargeDays: '10',
      lateChargePercentage: '5%',
      paymentWithin: '10',
      interestRate: '18% per year',
      agreeToAFeedOf: '$30',
      reInitDebitTimes: 'two',
      calendarDaysAferDebit: 'ten',
      CellPhoneNumber: 6466623303,
      unsubscribeEmailTo: 'support@getpaidup.com',
      customerServiceTelephoneNumber: '(855) 764-3232',
      signedAt: 'PaidUp, Inc.'
    },
    clientData: {
      DisputesTelephoneNumber: '(855) 764-3232',
      canSendMailAt: '2900 North Quinlan Park Rd. Suite 240-320. Autin, TX 78732',
      canCallYouAt: '(855) 764-3232'
    }
  },

  // Commerce settings
  commerce: {
    magento: {
      host: 'develop.getpaidup.com',
      port: 8888,
      path: '/api/xmlrpc/',
      login: 'magento',
      pass: 'Sv38SJVR'
    },
    category: {
      teams: 3,
      merchandise: 4
    },
    products: {
      fee: {
        id: 9,
        sku: 'fee'
      },
      interest: {
        id: 10,
        sku: 'interest'
      },
      defaultValue: {
        visibility: '4',
        urlPath: 'urlPath',
        urlKey: 'urlKey',
        taxClassId: '0',
        status: '1',
        price: '100',
        websites: '1',
        set: '9',
        type: 'grouped'
      }
    },
    testing: {
      teamId: 2
    },
    defaultAddress: [
      {
        mode: 'billing',
        firstName: 'cs firstName',
        lastName: 'cs lastName',
        address1: '801 east 11th st',
        address2: '801 east 11th st',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702',
        country: 'US',
        telephone: '+1 320123245'
      },
      {
        mode: 'shipping',
        firstName: 'firstName cs',
        lastName: 'lastName cs',
        address1: '801 east 11th st',
        address2: '801 east 11th st',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702',
        country: 'US',
        telephone: '+1 320123245'
      }
    ],
    shippingMethod: 'freeshipping_freeshipping',
    paymentMethod: 'purchaseorder'
  },
  payment: {
    legalEntity: {
      type: 'company'
    }
  },
  balanced: {
    api: 'ak-test-p8Ob9vp9GnqWNwFf6CeLLokeQsf76RIe',
    marketplace: 'TEST-MP2OaM2stYkoWBlGFd0M8YV7',
    appearsOnStatementAs: 'Conv. Select'
  },
  plaid: {
    env: 'sandbox',
    clientName: 'Paidup dev.',
    key: 'c104e73c056e34530e2c5774e6fc5f',
    product: 'auth'
  },
  stripe: {
    apiPublic: 'pk_test_y86FeOIMDzHKLvR5xkylpKrg',
    maxSizeMeta: 49,
    capAmount: 625
  },
  mixpanel: {
    apiKey: 'f97659afce9c44283fbd59ad718803dc'
  },
  encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==',
  loan: {
    defaults: {
      interestRate: 8.99,
      periodDuration: 1,
      periodType: 'minutes',
      billingFormat: 'MM/DD hh:mm',
      billingDate: '',
      billingDelay: 3,
      billingDelayType: 'minutes'
    },
    application: {
      user: {
        encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ=='
      }
    },
    contract: {
      htmlPdfOptions: {
        timeout: 60000,
        'format': 'A4',
        'orientation': 'portrait',
        // Page options
        'border': '0',
        'header': {
          'height': '45mm',
          'contents': '<div style="text-align: right;">CS</div>'
        },
        'footer': {
          'height': '28mm',
          'contents': '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>'
        },

        'type': 'pdf',
        'quality': '10',

        'directory': path.normalize(__dirname + '/../../..') + '/media/docs/'
      }
    }
  },
  notifications: {
    from: 'felipe@getpaidup.com',
    name: 'Felipe',
    charge: {
      template: {
        noFuturePayments: 'cf4ac7cb-8571-4e4c-9c2e-59ae49e21118',
        withFuturePayments: 'f7f3c212-fe1c-4381-9db0-a330c9f43b76'
      }
    },
    invoice: {
      template: {
        allFuturePayments: '4089244c-b74e-48d8-86a9-71102a4ee69d',
        asapAndFuturePayments: '614fa5f8-824e-470b-8add-ce22ac26ea37',
        asapPayments: '387b08a5-18ea-4c17-972b-46ff046c3390'
      }
    },
    reminderNoPaymentAdded: {
      period: 'minutes',
      value: 2
    },
    reminderNoBankAccountVerified: {
      period: 'days',
      value: 2
    },
    reminderChargeAccount: {
      days: 4,
      cronFormat: '30 05 * * *',
      template:  {
        noFuturePayments: '91cc82fe-d8a4-46a3-8de7-6e581f74f7fe',
        withFuturePayments: '5c40bb3c-2a41-494d-9541-f12ac50892c4'
      }
    },
    reminderEmailPayment: {
      period: 'hours',
      value: 72
    }
  },
  sendgrid: {
    token: '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'
  },
  cronjob: {
    pidFile: path.normalize(__dirname + '/../../..') + '/var/cronjob.pid',
    pathPidFile: path.normalize(__dirname + '/../../..') + '/var/'
  },
  connections: {
    me: {
      token: 'TDCSAppToken-CHANGE-ME'
    },
    user: {
      urlPrefix: '/api/v1',
      isHttp: false,
      host: 'localhost',
      port: 9001,
      token: 'TDUserToken-CHANGE-ME!'
    },
    payment: {
      urlPrefix: '/api/v1',
      isHttp: false,
      host: 'localhost',
      port: 9005,
      token: 'TDPaymentToken-CHANGE-ME!',
      baseUrl: 'http://localhost:9005/'
    },
    commerce: {
      urlPrefix: '/api/v1',
      isHttp: false,
      host: 'localhost',
      port: 9002,
      token: 'TDCommerceToken-CHANGE-ME!',
      baseUrl: 'http://localhost:9002/'
    },
    schedule: {
      urlPrefix: '/api/v2',
      isHttp: false,
      host: 'localhost',
      port: 9006,
      token: 'tdschedule-secret',
      baseUrl: 'http://localhost:9006/'
    },
    product: {
      urlPrefix: '/api/v1',
      isHttp: false,
      host: 'localhost',
      port: 9007,
      token: 'puproduct-secret',
      baseUrl: 'http://localhost:9007/'
    }
  },
  logger: {
    token: 'f5ea6cdf-b8c0-44ca-962f-1328873c5974'
  },
  prerender: {
    token: 'U3jxQ8zAatml2xL5LVd1'
  },
  cors: {
    enable: true,
    corsWhitelist: ['http://localhost:4000', 'https://admin.getpaidup.com', 'https://admstg.getpaidup.com', 'https://admdev.getpaidup.com']
  }

}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {})
