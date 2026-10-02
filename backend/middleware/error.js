exports.notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

exports.errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value, this record already exists" });
  }
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
};