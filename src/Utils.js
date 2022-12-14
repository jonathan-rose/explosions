export default class Utils {

    // Returns the number in scientific notation if bigger than 10^12
    static sanitize(n) {
        if (n > 1000000000000) {
            return n.toExponential(5);
        }
        return n;
    }

    // silly JavaScript, need an actual mod function that works on
    // negatives
    static mod(n, m) {
        return ((n % m) + m) % m;
    }
}
