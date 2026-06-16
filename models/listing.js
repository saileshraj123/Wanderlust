const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,

    // image: {
    //     filename: {
    //         type: String,
    //         default: "listingimage",
    //     },
    //     url: {
    //         type: String,
    //         default:
    //             "https://images.unsplash.com/photo-1542708993627-b6e5bbae43c4?q=80&w=1144&auto=format&fit=crop",
    //         set: (v) =>
    //             v === ""
    //                 ? "https://images.unsplash.com/photo-1542708993627-b6e5bbae43c4?q=80&w=1144&auto=format&fit=crop"
    //                 : v,
    //     },
    // },


    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type:[Number],
            required: true
        }
    }

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
