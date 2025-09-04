// Generic DB helpers built on Mongoose

// Find a single document
export const findOne = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
  return await model.findOne(filter).select(select).populate(populate).lean();
};

// Find document by ID
export const findById = async ({ model, id, select = "", populate = [] } = {}) => {
  return await model.findById(id).select(select).populate(populate).lean();
};

// Create documents (returns created docs array)
export const create = async ({ model, data = [{}], options = { validateBeforeSave: true } } = {}) => {
  return await model.create(data, options);
};

// Update (findOneAndUpdate and return updated doc)
export const update = async ({ model, filter = {}, data = {}, options = { new: true, runValidators: true } } = {}) => {
  return await model.findOneAndUpdate(filter, data, options);
};

// Update one (returns write result)
export const updateOne = async ({ model, filter = {}, data = {}, options = { runValidators: true } } = {}) => {
  return await model.updateOne(filter, data, options);
};

// Find one and update with select & populate
export const findOneAndUpdate = async ({ model, filter = {}, data = {}, select = "", populate = [], options = { runValidators: true, new: true } } = {}) => {
  return await model.findOneAndUpdate(filter, data, options).select(select).populate(populate);
};

// Delete one document
export const deleteOne = async ({ model, filter = {} } = {}) => {
  return await model.deleteOne(filter);
};

// Delete many documents (optional)
export const deleteMany = async ({ model, filter = {} } = {}) => {
  return await model.deleteMany(filter);
};
