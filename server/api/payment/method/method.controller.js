'use strict'

const CommerceService = require('../../commerce/order/order.service')
const PaymentService = require("../payment.service");

exports.remove = function (req, res) {
    if (!req.body || !req.params.accountId) {
        return res.status(400).json({
            'code': 'ValidationError',
            'message': 'payment method id is required'
        })
    }
    let accountId = req.params.accountId;
    let userId = req.user.meta.TDPaymentId;

    CommerceService.getOrdersByPaymentMethod(req.user._id, accountId, ["pending", "failed", "disabled"], (err, data) => {

        if (err) {
            return handleError(res, err)
        }
        if (Array.isArray(data.orders) && data.orders.length === 0) {
            if (accountId.startsWith
                ("card_")) {
                PaymentService.deleteCardAccount(userId, accountId, (err, data) => {
                    if (err) {
                        return handleError(res, err);
                    }
                    return res.status(200).json(data);
                })
            } else if (accountId.startsWith("ba_")) {
                PaymentService.deleteBankAccount(userId, accountId, (err, data) => {
                    if (err) {
                        return handleError(res, err);
                    }
                    return res.status(200).json(data);
                })
            } else {
                res.status(400).json({ message: "account not supported" });
            }

        } else {
            res.status(400).json(data);
        }


    });



}

function handleError(res, err) {
    console.log(err)
    let httpErrorCode = 500
    if (err.name === 'ValidationError' || err.code === 'StripeCardError') {
        httpErrorCode = 400
    }
    return res.status(httpErrorCode).json({
        code: err.type,
        message: err.message,
        errors: err.details
    })
}
