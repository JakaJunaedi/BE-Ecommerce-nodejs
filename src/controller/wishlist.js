const Wishlist = require('../models/wishlist');

exports.addWishlist = (req, res) => {
    return res.status(200).json({
        message: 'wishlist'
    });
}