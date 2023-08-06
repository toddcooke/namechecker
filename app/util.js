// From https://stackoverflow.com/a/27995370/3569329
function stringPermutations(input) {
  const letters = input.split("");
  const permCount = 1 << input.length;
  var res = [];
  for (let perm = 0; perm < permCount; perm++) {
    // Update the capitalization depending on the current permutation
    letters.reduce((perm, letter, i) => {
      letters[i] = perm & 1 ? letter.toUpperCase() : letter.toLowerCase();
      return perm >> 1;
    }, perm);

    const result = letters.join("");
    res.push(result);
  }
  return res;
}
