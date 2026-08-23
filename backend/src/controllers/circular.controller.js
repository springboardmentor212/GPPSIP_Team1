const Circular = require('../models/circular.model');

exports.getAllCirculars = async (req, res, next) => {
    try {
        const { status, category } = req.query;
        let query = {};
        if (status) query.status = status;
        if (category) query.category = category;

        const circulars = await Circular.find(query)
            .populate('publishedBy', 'fullName email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, count: circulars.length, circulars });
    } catch (err) {
        next(err);
    }
};

exports.getCircularById = async (req, res, next) => {
    try {
        const circular = await Circular.findById(req.params.id).populate('publishedBy', 'fullName email');
        if (!circular) return res.status(404).json({ success: false, message: 'Circular not found' });
        res.status(200).json({ success: true, circular });
    } catch (err) {
        next(err);
    }
};

exports.createCircular = async (req, res, next) => {
    try {
        req.body.publishedBy = req.user.id;
        const circular = await Circular.create(req.body);
        res.status(201).json({ success: true, message: 'Circular created', circular });
    } catch (err) {
        next(err);
    }
};

exports.updateCircular = async (req, res, next) => {
    try {
        const circular = await Circular.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!circular) return res.status(404).json({ success: false, message: 'Circular not found' });
        res.status(200).json({ success: true, message: 'Circular updated', circular });
    } catch (err) {
        next(err);
    }
};

exports.deleteCircular = async (req, res, next) => {
    try {
        const circular = await Circular.findByIdAndDelete(req.params.id);
        if (!circular) return res.status(404).json({ success: false, message: 'Circular not found' });
        res.status(200).json({ success: true, message: 'Circular deleted' });
    } catch (err) {
        next(err);
    }
};
