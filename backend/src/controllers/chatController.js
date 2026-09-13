const aiService = require("../services/aiService");


const chat = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const response =
            await aiService.generateAIResponse(message);

        res.status(200).json({
            success: true,
            data: {
                message: response
            }
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    chat
};