import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI as string);
mongoose.Promise = global.Promise;

const recipeSchema = new Schema(
  {
    userId: String,
    title: String,
    img: String,
    ingredients: [String],
    procedure: [String],
    likes: Number,
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export default Recipe;
