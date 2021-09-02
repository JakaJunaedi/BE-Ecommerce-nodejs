const { addWishlist } = require("../controller/wishlist");

const router = require("express").Router();

router.get('/addwishlist', addWishlist);

module.exports = router;