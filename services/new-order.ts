import {NextFunction, Request, Response} from "express";
import {Connection} from "mysql";
import {Customer} from "../models/customer";
import {InsertResult} from "../models/insert-result";
import {queryGetCustomer} from "./get-customer";
import {Cart} from "../models/cart";

const createRef = (digit: number) => {
    const possibles = "QWERTYUIOPASDFGHJKLZXCVBN";
    let text = "";
    for (let i = 0; i < digit - 1; i++)
        text += possibles.charAt(Math.floor(Math.random() * possibles.length));
    return text;
};


const now = ():string=>{

    const checkTime = (i:number) => {
        return (i < 10) ? "0" + i : i;
    };

    let date = new Date(),
        yyyy = date.getFullYear().toString(),
        mm = (date.getMonth()+1).toString(),
        dd  = date.getDate().toString(),
        mmChars = mm.split(''),
        ddChars = dd.split(''),
        DATE = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);

    let h = checkTime(date.getHours()),
        m = checkTime(date.getMinutes()),
        s = checkTime(date.getSeconds()),
        HOUR = h + ":" + m + ":" + s;

    return DATE + " " + HOUR;
};


const queryInsertCard = (connection:Connection,customer:Customer) :Promise<InsertResult> => {

    //hack
    let id_guest = 1,
        id_address_delivery = 9,
        id_address_invoice = 9,
        id_carrier = 15;

    const mQuery = `INSERT INTO ps_cart(   id_shop_group, 
                    id_shop, 
                    id_carrier, 
                    delivery_option, 
                    id_lang, 
                    id_address_delivery, 
                    id_address_invoice, 
                    id_currency, 
                    id_customer, 
                    id_guest, 
                    secure_key,
                    recyclable, 
                    gift, 
                    gift_message,
                    mobile_theme,
                    allow_seperated_package,
                    date_add,
                    date_upd) 
            VALUES( 1, 
                    1, 
                    ${id_carrier}, 
                    'a:1:{i:9;s:3:"15,";}',
                    1,
                    ${id_address_delivery},
                    ${id_address_invoice},
                    1,
                    ${customer.id_customer},
                    ${id_guest}, 
                    '${customer.secure_key}', 
                    0, 
                    0, 
                    '',
                    0, 
                    0,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP)`;

    return new Promise((resolve,reject)=>{
        connection.query(mQuery, (error:any, results:InsertResult, fields)=>{
            if(error){
                reject(error);
                return;
            }
            return resolve(results);
        });
    })
};



const queryInsertOrder = (connection:Connection,customer:Customer,idCart:number,price:number) :Promise<InsertResult> => {

    //tmp hack
    let id_carrier = 15,
        id_address_delivery = 9,
        id_address_invoice = 9,
        current_state = 12;

    let ref = createRef(9);

    const mQuery = `INSERT INTO ps_orders (reference, 
                                             id_shop_group,
                                             id_shop,
                                             id_carrier,
                                             id_lang,
                                             id_customer,
                                             id_cart,
                                             id_currency,
                                             id_address_delivery,
                                             id_address_invoice,
                                             current_state,
                                             secure_key,
                                             payment,
                                             conversion_rate,
                                             module,
                                             recyclable,
                                             gift,
                                             gift_message,
                                             mobile_theme,
                                             shipping_number,
                                             total_discounts,
                                             total_discounts_tax_incl,
                                             total_discounts_tax_excl,
                                             total_paid,
                                             total_paid_tax_incl,
                                             total_paid_tax_excl,
                                             total_paid_real,
                                             total_products,
                                             total_products_wt,
                                             total_shipping,
                                             total_shipping_tax_incl,
                                             total_shipping_tax_excl,
                                             carrier_tax_rate,
                                             total_wrapping,
                                             total_wrapping_tax_incl,
                                             total_wrapping_tax_excl,
                                             round_mode,
                                             round_type,
                                             invoice_number,
                                             delivery_number,
                                             invoice_date,
                                             delivery_date,
                                             valid,
                                             date_add,
                                             date_upd) 
                                  VALUES     ('${ref}',
                                             1,
                                             1,
                                             ${id_carrier},
                                             1,
                                             ${customer.id_customer},
                                             ${idCart},
                                             1,
                                             ${id_address_delivery},
                                             ${id_address_invoice},
                                             ${current_state},
                                             '${customer.secure_key}',
                                             'Payment by check',
                                             '1.000000',
                                             'ps_checkpayment',
                                             0,
                                             0,
                                             '',
                                             0,
                                             '',
                                             '0.000000',
                                             '0.000000',
                                             '0.000000',
                                             '${price}',
                                             '${price}',
                                             '${price}',
                                             '${price}',
                                             '${price}',
                                             '0.000000',
                                             '0.000000',
                                             '0.000000',
                                             '0.000000',
                                             '0.000',
                                             '0.000000',
                                             '0.000000',
                                             '0.000000',
                                             2,
                                             2,
                                             0,
                                             0,
                                             '0000-00-00 00:00:00',
                                             '0000-00-00 00:00:00',
                                             0,
                                            CURRENT_TIMESTAMP,
                                            CURRENT_TIMESTAMP);`;

    return new Promise((resolve,reject)=>{
        connection.query(mQuery, (error:any, results:InsertResult, fields)=>{
            if(error){
                reject(error);
                return;
            }
            return resolve(results);
        });
    })
};


const queryInsertOrderDetail = (connection:Connection,customer:Customer,idCart:number,idOrder:number,idProduct:number,nameProduct:string,price:number) :Promise<InsertResult> => {

    //tmp hack
    let product_reference = "";
    let product_name = nameProduct;

    const mQuery = `INSERT INTO ps_order_detail (id_order,
                         id_order_invoice,
                         id_warehouse,
                         id_shop,
                         product_id,
                         product_attribute_id,
                         id_customization,
                         product_name,
                         product_quantity,
                         product_quantity_in_stock,
                         product_quantity_refunded,
                         product_quantity_return,
                         product_quantity_reinjected,
                         product_price,
                         reduction_percent,
                         reduction_amount,
                         reduction_amount_tax_incl,
                         reduction_amount_tax_excl,
                         group_reduction,
                         product_quantity_discount,
                         product_ean13,
                         product_isbn,
                         product_upc,
                         product_reference,
                         product_supplier_reference,
                         product_weight,
                         id_tax_rules_group,
                         tax_computation_method,
                         tax_name,
                         tax_rate,
                         ecotax,
                         ecotax_tax_rate,
                         discount_quantity_applied,
                         download_hash,
                         download_nb,
                         download_deadline,
                         total_price_tax_incl,
                         total_price_tax_excl,
                         unit_price_tax_incl,
                         unit_price_tax_excl,
                         total_shipping_price_tax_incl,
                         total_shipping_price_tax_excl,
                         purchase_supplier_price,
                         original_product_price,
                         original_wholesale_price) 
                VALUES   (${idOrder},
                         0,
                         0,
                         1,
                         ${idProduct},
                         0,
                         0,
                         '${product_name}',
                         1,
                         -1,
                         0,
                         0,
                         0,
                         '0.000000',
                         '0.00',
                         '0.000000',
                         '0.000000',
                         '0.000000',
                         '0.00',
                         '0.000000',
                         '',
                         '',
                         '',
                         '${product_reference}',
                         '',
                         '0.000000',
                         1,
                         0,
                         '',
                         '0.000',
                         '0.000000',
                         '0.000',
                         0,
                         '',
                         0,
                         '0000-00-00 00:00:00',
                         '${price}',
                         '${price}',
                         '${price}',
                         '${price}',
                         '0.000000',
                         '0.000000',
                         '0.000000',
                         '0.000000',
                         '0.000000');`;

    return new Promise((resolve,reject)=>{
        connection.query(mQuery, (error:any, results:InsertResult, fields)=>{
            if(error){
                reject(error);
                return;
            }
            return resolve(results);
        });
    })
};

export default (connection:Connection) => (req:Request,res:Response,next:NextFunction) => {

    let email = "apoticare@apoticare.com";
    let idProduct = 17;
    let price = 49;
    let name = "NEW_PRODUCT";

    queryGetCustomer(connection,email).then(
        customer => {

            queryInsertCard(connection,customer).then(
                resultInsertCart => {
                    queryInsertOrder(connection,customer,resultInsertCart.insertId,price).then(
                        resultInsertOrder => {
                            queryInsertOrderDetail(connection,customer,resultInsertCart.insertId,resultInsertOrder.insertId,idProduct,name,price).then(
                                result =>  res.json(resultInsertOrder),
                                error => res.json(error)
                            )
                        },
                        error => res.json(error)
                    )
                },
                error => res.json(error)
            )
        },
        error => res.json(error)
    )

}


















/*

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

// pas changer
INSERT INTO ps_carrier` (`id_carrier`, `id_reference`, `id_tax_rules_group`, `name`, `url`, `active`, `deleted`, `shipping_handling`, `range_behavior`, `is_module`, `is_free`, `shipping_external`, `need_range`, `external_module_name`, `shipping_method`, `position`, `max_width`, `max_height`, `max_depth`, `max_weight`, `grade`) VALUES
(15, 14, 0, 'Apoticare', '', 1, 0, 1, 0, 1, 1, 1, 1, 'fspickupatstorecarrier', 2, 1, 0, 0, 0, '0.000000', 9);

INSERT INTO `ps_product` (`id_product`, `id_supplier`, `id_manufacturer`, `id_category_default`, `id_shop_default`, `id_tax_rules_group`, `on_sale`, `online_only`, `ean13`, `isbn`, `upc`, `ecotax`, `quantity`, `minimal_quantity`, `price`, `wholesale_price`, `unity`, `unit_price_ratio`, `additional_shipping_cost`, `reference`, `supplier_reference`, `location`, `width`, `height`, `depth`, `weight`, `out_of_stock`, `quantity_discount`, `customizable`, `uploadable_files`, `text_fields`, `active`, `redirect_type`, `id_type_redirected`, `available_for_order`, `available_date`, `show_condition`, `condition`, `show_price`, `indexed`, `visibility`, `cache_is_pack`, `cache_has_attachments`, `is_virtual`, `cache_default_attribute`, `date_add`, `date_upd`, `advanced_stock_management`, `pack_stock_type`, `state`) VALUES
(52, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '40.833333', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-10-23 12:57:47', '2017-11-12 15:18:14', 0, 3, 1),
(53, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '49.166667', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-10-23 13:00:49', '2017-11-13 14:56:17', 0, 3, 1),
(54, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '57.500000', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-10-23 13:01:21', '2017-11-12 15:22:18', 0, 3, 1),
(58, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '40.833333', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-06 14:16:53', '2017-11-12 15:24:27', 0, 3, 1),
(59, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '49.166667', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-06 14:20:54', '2017-11-12 15:25:47', 0, 3, 1),
(60, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '57.500000', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-06 14:23:17', '2017-11-12 15:27:15', 0, 3, 1),
(62, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '40.833333', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 13:45:47', '2017-11-15 13:56:01', 0, 3, 1),
(63, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '49.166667', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 13:53:55', '2017-11-16 12:57:59', 0, 3, 1),
(64, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '40.833333', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 14:20:46', '2017-11-16 12:58:14', 0, 3, 1),
(65, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '49.166667', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 14:26:04', '2017-11-16 12:58:11', 0, 3, 1),
(66, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '57.500000', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 14:32:20', '2017-11-16 12:58:23', 0, 3, 1),
(67, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '57.500000', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 14:34:41', '2017-11-16 12:59:43', 0, 3, 1),
(68, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '40.833333', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 14:38:42', '2017-11-16 12:59:52', 0, 3, 1),
(69, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '49.166667', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 14:43:45', '2017-11-16 13:00:00', 0, 3, 1),
(70, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '57.500000', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 14:50:03', '2017-11-16 13:00:09', 0, 3, 1),
(71, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '40.833333', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 15:03:17', '2017-11-16 13:00:17', 0, 3, 1),
(72, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '49.166667', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 15:06:03', '2017-11-16 13:01:35', 0, 3, 1),
(73, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '57.500000', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 15:09:45', '2017-11-16 13:01:40', 0, 3, 1),
(74, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '40.833333', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 15:31:59', '2017-11-16 13:01:48', 0, 3, 1),
(75, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '49.166667', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 15:35:17', '2017-11-16 13:01:57', 0, 3, 1),
(76, 0, 0, 15, 1, 1, 0, 0, '', '', '', '0.000000', 0, 1, '57.500000', '0.000000', '', '0.000000', '0.00', '', '', '', '0.000000', '0.000000', '0.000000', '0.000000', 2, 0, 1, 0, 1, 1, '404', 0, 1, '0000-00-00', 0, 'new', 1, 1, 'both', 0, 0, 0, 0, '2017-11-09 15:42:31', '2017-11-26 18:06:47', 0, 3, 1);

///cart
INSERT INTO `ps_stock_available` (`id_stock_available`, `id_product`, `id_product_attribute`, `id_shop`, `id_shop_group`, `quantity`, `physical_quantity`, `reserved_quantity`, `depends_on_stock`, `out_of_stock`) VALUES
(67, 17, 0, 1, 0, -2, 0, 2, 0, 1),


//new:

INSERT INTO `ps_cart` (`id_cart`, `id_shop_group`, `id_shop`, `id_carrier`, `delivery_option`, `id_lang`, `id_address_delivery`, `id_address_invoice`, `id_currency`, `id_customer`, `id_guest`, `secure_key`, `recyclable`, `gift`, `gift_message`, `mobile_theme`, `allow_seperated_package`, `date_add`, `date_upd`, `checkout_session_data`) VALUES
(78, 1, 1, 15, 'a:1:{i:9;s:3:\"15,\";}', 1, 9, 9, 1, 3, 2265, '0273b20e0b75ca2e64322e5cd93485b1', 0, 0, '', 0, 0, '2018-01-21 12:12:19', '2018-01-21 12:12:45', '{\"checkout-personal-information-step\":{\"step_is_reachable\":true,\"step_is_complete\":true},\"checkout-addresses-step\":{\"step_is_reachable\":true,\"step_is_complete\":true,\"use_same_address\":true},\"checkout-delivery-step\":{\"step_is_reachable\":true,\"step_is_complete\":true},\"checkout-payment-step\":{\"step_is_reachable\":true,\"step_is_complete\":false},\"checksum\":\"a64387b71e76f3eb9a28eeb601476fd1ec0568dd\"}');

INSERT INTO `ps_orders` (`id_order`, `reference`, `id_shop_group`, `id_shop`, `id_carrier`, `id_lang`, `id_customer`, `id_cart`, `id_currency`, `id_address_delivery`, `id_address_invoice`, `current_state`, `secure_key`, `payment`, `conversion_rate`, `module`, `recyclable`, `gift`, `gift_message`, `mobile_theme`, `shipping_number`, `total_discounts`, `total_discounts_tax_incl`, `total_discounts_tax_excl`, `total_paid`, `total_paid_tax_incl`, `total_paid_tax_excl`, `total_paid_real`, `total_products`, `total_products_wt`, `total_shipping`, `total_shipping_tax_incl`, `total_shipping_tax_excl`, `carrier_tax_rate`, `total_wrapping`, `total_wrapping_tax_incl`, `total_wrapping_tax_excl`, `round_mode`, `round_type`, `invoice_number`, `delivery_number`, `invoice_date`, `delivery_date`, `valid`, `date_add`, `date_upd`) VALUES
(12, 'AIMMKHKJW', 1, 1, 15, 1, 3, 78, 1, 38, 9, 12, '0273b20e0b75ca2e64322e5cd93485b1', 'ChÃ¨que', '1.000000', 'ps_checkpayment', 0, 0, '', 0, '', '0.000000', '0.000000', '0.000000', '25.200000', '25.200000', '21.000000', '0.000000', '21.000000', '25.200000', '0.000000', '0.000000', '0.000000', '0.000', '0.000000', '0.000000', '0.000000', 2, 2, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, '2018-01-21 12:12:52', '2018-01-21 12:12:56');

INSERT INTO `ps_order_detail` (`id_order_detail`, `id_order`, `id_order_invoice`, `id_warehouse`, `id_shop`, `product_id`, `product_attribute_id`, `id_customization`, `product_name`, `product_quantity`, `product_quantity_in_stock`, `product_quantity_refunded`, `product_quantity_return`, `product_quantity_reinjected`, `product_price`, `reduction_percent`, `reduction_amount`, `reduction_amount_tax_incl`, `reduction_amount_tax_excl`, `group_reduction`, `product_quantity_discount`, `product_ean13`, `product_isbn`, `product_upc`, `product_reference`, `product_supplier_reference`, `product_weight`, `id_tax_rules_group`, `tax_computation_method`, `tax_name`, `tax_rate`, `ecotax`, `ecotax_tax_rate`, `discount_quantity_applied`, `download_hash`, `download_nb`, `download_deadline`, `total_price_tax_incl`, `total_price_tax_excl`, `unit_price_tax_incl`, `unit_price_tax_excl`, `total_shipping_price_tax_incl`, `total_shipping_price_tax_excl`, `purchase_supplier_price`, `original_product_price`, `original_wholesale_price`) VALUES
(23, 12, 0, 0, 1, 17, 0, 0, 'MA CREME LEGERE - Actif Pur NÂ° 16', 1, -1, 0, 0, 0, '40.833333', '0.00', '23.800000', '23.800000', '19.830000', '0.00', '26.400000', '', '', '', '3700425928053', '', '0.000000', 1, 0, '', '0.000', '0.000000', '0.000', 0, '', 0, '0000-00-00 00:00:00', '25.200000', '21.000000', '25.200000', '21.000000', '0.000000', '0.000000', '0.000000', '40.833333', '0.000000');

//maybe todo

INSERT INTO `ps_order_carrier` (`id_order_carrier`, `id_order`, `id_carrier`, `id_order_invoice`, `weight`, `shipping_cost_tax_excl`, `shipping_cost_tax_incl`, `tracking_number`, `date_add`) VALUES
(12, 12, 15, 0, '0.000000', '0.000000', '0.000000', '', '2018-01-21 12:12:52');

INSERT INTO `ps_order_detail_tax` (`id_order_detail`, `id_tax`, `unit_amount`, `total_amount`) VALUES
(23, 1, '4.200000', '4.200000');

INSERT INTO `ps_fspickupatstorecarrier` (`id_fspickupatstorecarrier`, `id_order`, `id_store`, `date_pickup`, `date_add`, `date_upd`) VALUES
(2, 12, 194, '2018-01-21 12:12:52', '2018-01-21 12:12:53', '2018-01-21 12:12:53');


 */

