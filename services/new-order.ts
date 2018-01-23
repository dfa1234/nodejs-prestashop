import {NextFunction, Request, Response} from "express";
import {Connection} from "mysql";

const createRef = (digit: number) => {
    const possibles = "QWERTYUIOPASDFGHJKLZXCVBN";
    let text = "";
    for (let i = 0; i < digit - 1; i++)
        text += possibles.charAt(Math.floor(Math.random() * possibles.length));
    return text;
};


let newOrder = {
    "reference": createRef(9),
    "id_shop_group": 1,
    "id_shop": 1,
    "id_carrier": 2,
    "id_lang": 1,
    "id_customer": 1,
    "id_cart": 1,
    "id_currency": 1,
    "id_address_delivery": 4,
    "id_address_invoice": 4,
    "current_state": 6,
    "secure_key": "b44a6d9efd7a0076a0fbce6b15eaf3b1",
    "payment": "Payment by check",
    "conversion_rate": "1.000000",
    "module": "ps_checkpayment",
    "recyclable": 0,
    "gift": 0,
    "gift_message": "",
    "mobile_theme": 0,
    "shipping_number": "",
    "total_discounts": "0.000000",
    "total_discounts_tax_incl": "0.000000",
    "total_discounts_tax_excl": "0.000000",
    "total_paid": "55.000000",
    "total_paid_tax_incl": "55.000000",
    "total_paid_tax_excl": "55.000000",
    "total_paid_real": "0.000000",
    "total_products": "53.000000",
    "total_products_wt": "53.000000",
    "total_shipping": "2.000000",
    "total_shipping_tax_incl": "2.000000",
    "total_shipping_tax_excl": "2.000000",
    "carrier_tax_rate": "0.000",
    "total_wrapping": "0.000000",
    "total_wrapping_tax_incl": "0.000000",
    "total_wrapping_tax_excl": "0.000000",
    "round_mode": 0,
    "round_type": 0,
    "invoice_number": 0,
    "delivery_number": 0,
    "invoice_date": null,
    "delivery_date": null,
    "valid": 0,
    "date_add": new Date(),
    "date_upd": new Date()
};

export default (connection:Connection) => (req:Request,res:Response,next:NextFunction) => {
    connection.query(
        `SELECT * FROM \`ps_orders\` `, (error, results, fields)=>{
            if(error){
                return res.json(error);
            }
            return res.json(results);
        }
    );
}
