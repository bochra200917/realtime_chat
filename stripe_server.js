const express = require("express");

const bodyparser = require('body-parser');

const router = express.Router();

router.use(bodyparser.urlencoded({ extended: false }));

router.use(bodyparser.json());

const stripe = require("stripe")("sk_test_51MlCMdDsUTcRUhIgfzUZHUsy6Zs8lz0viYpzbtrPh4VT8pVdsVUhurEEpa9JD1tr2k260f9wh6eVEWRFHHpnpmLD00l3uEYg97");

const cors = require('cors');
 
router.use(cors());

router.get('/test-stripe',(req,res)=>{
    res.json({"test":"welcome to stripe!"});
});
 
router.post('/checkout', async(req, res) => {
    try {
        console.log(req.body);
        token = req.body.token;
        email = req.body.email;
        totalPrice = req.body.totalPrice;
      const customer = stripe.customers
        .create({
          email: email,
          source: token.id
        })
        .then((customer) => {
          console.log(customer);
          return stripe.charges.create({
            amount: totalPrice*100,
            description: "pay for reservation",
            currency: "USD",
            customer: customer.id,
          });
        })
        .then((charge) => {
          console.log(charge);
            res.json({
              data:"success"
          })
        })
        .catch((err) => {
            res.json({
              data: "failure",
            });
        });
      return true;
    } catch (error) {
      return false;
    }
});

module.exports = router ;
 