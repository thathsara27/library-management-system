const router = require("express").Router();
let Supplier = require("../models/Supplier");

// Create (Add new supplier)
router.route("/").post((req, res) => {
    const { supplierName, contactPerson, email, phone, category, suppliedCount, rating } = req.body;

    const newSupplier = new Supplier({
        supplierName,
        contactPerson,
        email,
        phone,
        category,
        suppliedCount,
        rating
    });

    newSupplier.save()
        .then(() => {
            res.json("Supplier Added Successfully");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Error adding supplier", details: err.message });
        });
});

// Read (Get all suppliers)
router.route("/").get((req, res) => {
    Supplier.find()
        .then((suppliers) => {
            res.json(suppliers);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error fetching suppliers" });
        });
});

// Update (Edit supplier info)
router.route("/:id").put(async (req, res) => {
    let supplierId = req.params.id;
    const { supplierName, contactPerson, email, phone, category, suppliedCount, rating } = req.body;

    const updateSupplier = {
        supplierName,
        contactPerson,
        email,
        phone,
        category,
        suppliedCount,
        rating
    };

    await Supplier.findByIdAndUpdate(supplierId, updateSupplier)
        .then(() => {
            res.status(200).send({ status: "Supplier updated" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "Error with updating data", error: err.message });
        });
});

// Delete (Remove supplier)
router.route("/:id").delete(async (req, res) => {
    let supplierId = req.params.id;

    await Supplier.findByIdAndDelete(supplierId)
        .then(() => {
            res.status(200).send({ status: "Supplier deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with delete supplier", error: err.message });
        });
});

// Read One (Get single supplier)
router.route("/:id").get(async (req, res) => {
    let supplierId = req.params.id;
    await Supplier.findById(supplierId)
        .then((supplier) => {
            res.status(200).send({ status: "Supplier fetched", supplier });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with get supplier", error: err.message });
        });
});

module.exports = router;
