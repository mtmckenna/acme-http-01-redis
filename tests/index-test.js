const tester = require("greenlock-challenge-test");
const challenge = require("../").create({});
const domain = "example.com";

tester
.test("http-01", domain, challenge)
.then(() => {
  console.info("Tests passed...");
  process.exit();
})
.catch((error) => {
  console.error(error);
  process.exit(1);
});