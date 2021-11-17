const protect = (req, res, next) => { //This protects the postRoute to insure that users are in the database before making posts
    const { user } = req.session;

    if (!user) {
        return res.status(401).json({ status: 'fail', message: 'unauthorized' });
    };

    req.user = user;

    next();
}

module.exports = protect;