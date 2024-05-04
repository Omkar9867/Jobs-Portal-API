const testController = (req, res) => {
  try {
    const { name } = req.body;
    res.status(200).send(`Welcome ${name}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {testController}