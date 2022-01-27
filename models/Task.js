const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            required: true,
            enum: ["new", "open", "complete"],
        },
        title: {
            type: String,
            required: true,
        },
        description: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
