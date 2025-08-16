const { User } = require("../Modles/User");
const redisClient = require("../redis/redisClient");

exports.getAll = async (req, res) => {
  try {
    const cachedKey = "users:all";
    const cachedUsers = await redisClient.get(cachedKey);

    if (cachedUsers) {
      console.log("✅ From Redis");
      return res.json(JSON.parse(cachedUsers));
    }

    const users = await User.find({});
    await redisClient.set(cachedKey, JSON.stringify(users), { EX: 3600 }); //1hr

    console.log("📦 From MongoDB");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.createUser = async (req, res) => {
  const { email, name } = req.body;

  const newUser = new User({ email, name });
  await newUser.save();

  // Cache the new user
  redisClient.set(`user:${newUser._id}`, JSON.stringify(newUser), { EX: 3600 });
  redisClient.del("users:all");

  res.status(201).json(newUser);
};

exports.getAUser = async (req, res) => {
  const userId = req.params.id;

  const cachedUser = await redisClient.get(`user:${userId}`);

  if (cachedUser) {
    return res.json(JSON.parse(cachedUser));
  }

  const user = await User.findById(userId);

  if (user) {
    redisClient.set(`user:${userId}`, JSON.stringify(user), { EX: 3600 });

    return res.json(user);
  }

  return res.status(404).json({ message: "user not found" });
};

exports.updateAUser = async (req, res) => {
  const { email, name } = req.body;
  const userId = req.params.id;

  const updatedUser = await User.findByIdAndUpdate(userId, {
    email,
    name,
  });

  redisClient.del("users:all");
  redisClient.set(`user:${updatedUser._id}`, JSON.stringify(updatedUser));
  res.json(updatedUser);
};

exports.deleteAUser = async (req, res) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);

  // Delete the cache
  redisClient.del("users:all");
  redisClient.del(`user:${req.params.id}`);
  res.json(deletedUser);
};
