const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5252;
app.use(cors());
app.use(express.json());


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

async function run() {
  try {
    app.get("/config", (req, res) => {
      res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
    });

    app.post("/create-payment-intent", async (req, res) => {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          currency: "EUR",
          amount: 101,
          automatic_payment_methods: { enabled: true },
        });

        // Send publishable key and PaymentIntent details to client
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (e) {
        return res.status(400).send({
          error: {
            message: e.message,
          },
        });
      }
    });




  } finally {
  }
}
run().catch((error) => console.error(error));



app.get("/", (req, res) => {
  res.send(" server running stripe");
});
app.listen(port, () => {
  console.log(` server running on port: ${port}`);
});









