const Testimonial = require("../model/testimonials");


const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllTestimonials
}