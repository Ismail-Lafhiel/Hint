const User = require('../models/User');
const path = require('path');
const multer = require('multer');
const e = require('express');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

const editProfile = async (req, res) => {

    const id = req.body.id;
    const fullname = req.body.fullname;
    const username = req.body.username;
    const bio = req.body.bio;
    const banner = req.files && req.files.banner ? req.files.banner[0].filename : null;
    const image = req.files && req.files.image ? req.files.image[0].filename : null;
    const defaultBg = req.body.defaultBg;
    const defaultPic = req.body.defaultPic;
    const color1 = req.body.color1;
    const color2 = req.body.color2;
    const color3 = req.body.color3;

    try {
        const user = await User.findOne({
            where: { id: id },
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (banner && parseInt(defaultBg) == 0) {
            user.banner = `/uploads/${banner}`;
            
        }
        if (parseInt(defaultBg) == 1) {
            user.banner = '/img/default_banner.svg';
        }
        if (image && parseInt(defaultPic) == 0) {
            user.image = `/uploads/${image}`;
        }
        if (parseInt(defaultPic) == 1) {
            user.image = '/img/default.jpg';
        }
        if (fullname) {
            user.fullname = fullname;
        }
        if (username) {
            user.username = username;
        }
        if (bio) {
            user.bio = bio;
        }

        user.color1 = color1;
        user.color2 = color2;
        user.color3 = color3;
        
        req.session.user = user;
        await user.save();
        res.send('Profile updated');
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Database error');
    }
}

const usernameCheck = async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({
            where: { username: username },
        });

        if (user) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Database error');
    }
}

module.exports = {
    editProfile,
    upload,
    usernameCheck
};