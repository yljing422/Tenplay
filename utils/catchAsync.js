// replace try catch in async function
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}