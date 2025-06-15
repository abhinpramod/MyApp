const Review = require("../model/review.model");
const Store = require("../model/store.model");

exports.createReview = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

 

    // Create new review
    const review = new Review({
      store: storeId,
      user: userId,
      userName,
      rating,
      comment
    });


  

    await review.save();

    // Add review to store's reviews array
    store.reviews.push(review._id);
    
    // Calculate new average rating
    const reviews = await Review.find({ store: storeId });
    const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    store.averageRating = totalRatings / reviews.length;
    store.totalReviews = reviews.length;
    
    await store.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

exports.getStoreReviews = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const reviews = await Review.find({ store: storeId })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};