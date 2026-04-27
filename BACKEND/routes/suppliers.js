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
router.route("/").get(async (req, res) => {
    try {
        let suppliers = await Supplier.find();
        
        // Seed database if empty
        if (suppliers.length === 0) {
            const mockSuppliers = [
                { supplierName: "Global Academic Press", contactPerson: "Dr. Alan Grant", email: "alan@gapress.com", phone: "+1-555-0100", category: "Academic", suppliedCount: 1250, rating: 5 },
                { supplierName: "TechBooks Ltd", contactPerson: "Sarah Connor", email: "sarah@techbooks.com", phone: "+1-555-0101", category: "Technology", suppliedCount: 840, rating: 4 },
                { supplierName: "Sci-Fi Universe", contactPerson: "Luke Skywalker", email: "luke@scifiu.com", phone: "+1-555-0102", category: "Fiction", suppliedCount: 520, rating: 5 },
                { supplierName: "Journal Nexus", contactPerson: "Jane Goodall", email: "jane@jnexus.com", phone: "+1-555-0103", category: "Journals", suppliedCount: 310, rating: 3 },
                { supplierName: "University Books", contactPerson: "Prof. Xavier", email: "profx@ubooks.edu", phone: "+1-555-0104", category: "Academic", suppliedCount: 2200, rating: 5 },
                { supplierName: "Byte Content", contactPerson: "Ada Lovelace", email: "ada@bytecontent.com", phone: "+1-555-0105", category: "Technology", suppliedCount: 450, rating: 4 },
                { supplierName: "Classic Literature Co.", contactPerson: "Charles Dickens", email: "charles@classiclit.com", phone: "+1-555-0106", category: "Fiction", suppliedCount: 950, rating: 5 },
                { supplierName: "Modern Medical Journals", contactPerson: "Dr. Gregory", email: "greg@mmj.com", phone: "+1-555-0107", category: "Journals", suppliedCount: 180, rating: 2 },
                { supplierName: "Future Tech Publishers", contactPerson: "Elon Musk", email: "elon@futuretech.com", phone: "+1-555-0108", category: "Technology", suppliedCount: 110, rating: 4 },
                { supplierName: "History Archives", contactPerson: "Indiana Jones", email: "indy@archives.org", phone: "+1-555-0109", category: "Academic", suppliedCount: 630, rating: 5 }
            ];
            await Supplier.insertMany(mockSuppliers);
            suppliers = await Supplier.find();
        }
        
        res.json(suppliers);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching suppliers", details: err.message });
    }
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
