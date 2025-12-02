import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/create-awb", async (req, res) => {
  try {
    console.log("Creating it");
    res.json({
        "Name" : "Ibraheem"
    })
   /*
    const { order } = req.body;

    const dpdBody = {
      userName: process.env.DPD_USER,
      password: process.env.DPD_PASSWORD,
      recipient: {
        name: order.name,
        address: order.address,
        city: order.city,
        countryId: "RO",
        email: order.email,
        phone: order.phone
      },
      service: {
        id: 20   // Standard courier service, example
      },
      content: {
        parcelsCount: 1,
        totalWeight: order.weight || 1
      },
      payment: {
        paymentType: "SENDER",
        services: []
      }
    };

    const response = await axios.post(
      "https://api.dpd.ro/v1/shipment",
      dpdBody,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.error) {
      return res.status(400).json({ error: response.data.error });
    }

    res.json({
      awb: response.data.id,
      parcels: response.data.parcels,
      pickupDate: response.data.pickupDate
    });
    */

  } catch (error) {
    res.status(500).json({ error: "DPD request failed" });
  }
});
export const shipmentRoutes = router;
