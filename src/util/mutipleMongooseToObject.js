module.exports = {
    multipleMongooseToObject: function(mongooseArray) {
        return mongooseArray.map(mongoose => (mongoose && mongoose.toObject) ? mongoose.toObject() : mongoose);
      },
    mongooseToObject: function(mongoose) {
        return mongoose && mongoose.toObject ? mongoose.toObject() : mongoose
    }
}