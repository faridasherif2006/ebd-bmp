
import express from "express";

const app = express();
app.use(express.json());

let nextId = 4;

const listings = [
    { id: 1, title: "Nile View Apartment", pricePerNight: 85 },
    { id: 2, title: "Beach House", pricePerNight: 140 },
    { id: 3, title: "Desert Eco-Lodge", pricePerNight: 60 },
];

// Get all listings
function getAllListings() {
    return listings;
}

// Get one listing by ID
function getListingById(id) {
    return listings.find((listing) => listing.id === id);
}

// Add a listing
function addListing(data) {
    const listing = {
        id: nextId++,
        title: data.title,
        pricePerNight: data.pricePerNight,
    };

    listings.push(listing);
    return listing;
}

// Update a listing
function updateListing(id, data) {
    const listing = getListingById(id);

    if (listing) {
        listing.title = data.title;
        listing.pricePerNight = data.pricePerNight;
    }

    return listing;
}

// Delete a listing
function removeListing(id) {
    const index = listings.findIndex((item) => item.id === id);

    if (index === -1) {
        return undefined;
    }

    return listings.splice(index, 1)[0];
}

// GET all listings
function handleGetAll(req, res) {
    res.json(getAllListings());
}

// GET one listing
function handleGetOne(req, res) {
    const listing = getListingById(Number(req.params.id));

    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing);
}

// CREATE a listing
function handleCreate(req, res) {
    const data = req.body || {};

    if (!data.title || data.pricePerNight == null) {
        return res.status(400).json({
            error: "title and pricePerNight are required",
        });
    }

    res.status(201).json(addListing(data));
}

// UPDATE a listing
function handleUpdate(req, res) {
    const data = req.body || {};

    if (!data.title || data.pricePerNight == null) {
        return res.status(400).json({
            error: "title and pricePerNight are required",
        });
    }

    const listing = updateListing(Number(req.params.id), data);

    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing);
}

// DELETE a listing
function handleDelete(req, res) {
    const listing = removeListing(Number(req.params.id));

    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    res.status(204).end();
}

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to ebd bnb");
});

app.get("/api/listings", handleGetAll);
app.get("/api/listings/:id", handleGetOne);
app.post("/api/listings", handleCreate);
app.put("/api/listings/:id", handleUpdate);
app.delete("/api/listings/:id", handleDelete);

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});