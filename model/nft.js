const mongoose = require("mongoose");
// Object ID updates on upsert, so had to change back to manuial aproac. IN future, use version keys, they look like a good solution.

const NftSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  hash: {
    type: String,
  },
});

const Nft = mongoose.models?.Nft || mongoose.model("Nft", NftSchema);

export default Nft;
