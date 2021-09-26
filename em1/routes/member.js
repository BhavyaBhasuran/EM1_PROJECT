const fs = require('fs');

module.exports = {
    addmemberPage: (req, res) => {
        res.render('add-member.ejs', {
            title: "Welcome to chapter library| Add a new member"
            ,message: ''
        });
    },
    addmember: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let phone = req.body.phone;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username+ '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `members` WHERE username = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-member.ejs', {
                    message,
                    title: "Welcome to chapter library| Add a new member"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the member's details to the database
                        let query = "INSERT INTO `members` (first_name, last_name, phone, image, username) VALUES ('" +
                            first_name + "', '" + last_name + "', '" + phone + "',  '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-member.ejs', {
                        message,
                        title: "Welcome to chapter library | Add a new member"
                    });
                }
            }
        });
    },
    editmemberPage: (req, res) => {
        let memberId = req.params.id;
        let query = "SELECT * FROM `members` WHERE id = '" + memberId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-member.ejs', {
                title:"Edit  member"
                ,member: result[0]
                ,message: ''
            });
        });
    },
    editmember: (req, res) => {
        let memberId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let phone= req.body.phone;
        

        let query = "UPDATE `members` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `phone` = '" + phone+ "' WHERE `members`.`id` = '" + memberId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletemember: (req, res) => {
        let memberId = req.params.id;
        let getImageQuery = 'SELECT image from `members` WHERE id = "' + memberId + '"';
        let deleteUserQuery = 'DELETE FROM members WHERE id = "' + memberId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};
