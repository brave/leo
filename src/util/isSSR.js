export default (function isSSR() {
    try {
        return typeof document === 'undefined';
    } catch (e) {
        return true;
    }
})();