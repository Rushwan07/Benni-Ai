const Document = require("../models/documentModel")

exports.getMyDocuments = async (req, res) => {
    try {
        const documents = await Document.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: "success",
            results: documents.length,
            documents
        });

    } catch (error) {
        console.error("Error details:", error);

        return res.status(500).json({
            status: "error",
            message: "Failed to fetch documents"
        });
    }
};

exports.createDocument = async (req, res) => {
    try {

        const { title, content } = req.body;
        console.log("title content", title, content)

        if (!title || !content) {
            return res.status(400).json({
                status: "fail",
                message: "Title and content are required"
            });
        }

        const newDocument = new Document({
            title: title,
            content: content,
            user: req.user._id
        });

        await newDocument.save();

        return res.status(201).json({
            status: "success",
            message: "Document created successfully",
            document: newDocument
        });

    } catch (error) {
        console.error("Error details:", error);

        return res.status(500).json({
            status: "error",
            message: "Failed to create document",
            error: error.message
        });
    }
};


exports.updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const updateData = {};

        if (title !== undefined) {
            updateData.title = title;
        }

        if (content !== undefined) {
            updateData.content = content;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Nothing to update"
            });
        }

        const updatedDocument = await Document.findOneAndUpdate(
            {
                _id: id,
                user: req.user._id
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedDocument) {
            return res.status(404).json({
                status: "fail",
                message: "Document not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Document updated successfully",
            document: updatedDocument
        });

    } catch (error) {
        console.error("Error details:", error);

        return res.status(500).json({
            status: "error",
            message: "An error occurred while updating the document",
            error: error.message
        });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDocument = await Document.findOneAndDelete({
            _id: id,
            user: req.user._id
        });

        if (!deletedDocument) {
            return res.status(404).json({
                status: "fail",
                message: "Document not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Document deleted successfully"
        });

    } catch (error) {
        console.error("Error details:", error);

        return res.status(500).json({
            status: "error",
            message: "An error occurred while deleting the document",
            error: error.message
        });
    }
};