const User = require('../models/User');
const Article = require('../models/Article');


exports.getProfile = async (req, res) => {
    const userId = req.params.userId;

    try {
        const profile = await User.findOne({
            where: { id: userId },
        });
        res.render('profile', { 
            title: `${profile.fullname}'s Profile`,
            profile: profile,
            session: req.session
        });
    } catch (err) {
        console.error('Erreur de base de données :', err);
        res.status(500).send('Erreur de base de données');
    }
};
