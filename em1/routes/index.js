module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `members` ORDER BY id ASC"; // query database to get all the members

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to chapter library | View members"
                ,members: result
            });
        });
    },
};