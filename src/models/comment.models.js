import mongoose, {Schema} from "mongoose"
import mongooseAgregatePaginate from "mongoose-aggregate-paginate-v2";


const commentSchema = new Schema(
    {}
)

commentSchema.plugin(mongooseAgregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)