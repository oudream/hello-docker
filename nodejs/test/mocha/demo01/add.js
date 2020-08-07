function add(x, y) {
  return x + y;
}

for (var i = 1; i <= 5; i++) {
  index = 1
  out = () => {
    console.log(index++)
  }
  setTimeout(function timer() {
      out()
  }, i * 1000);
}

module.exports = add;
