const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({user: req.user._id});
        return res.send(tasks);
    } catch (e) {
        return res.status(400).send(e);
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const task = new Task(req.body);

        if (!req.body.user) {
            task.user = req.user._id;
        }

        await task.save();
        return res.send(task);
    } catch (e) {
        return res.status(400).send(e);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const taskData = req.body;
        const task = await Task.findOne({_id: req.params.id});

        if (req.user._id.toString() !== task.user.toString()) {
            return res.status(401).send("No task");
        }

        await Task.findByIdAndUpdate(
            {_id: req.params.id},
            {
                ...taskData,
            },
            {new: true},
            (e) => {
                if (e) return res.status(500).send(e);
            }
        );

        return res.send("successful");
    } catch (e) {
        return res.status(400).send(e);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id});

        if (req.user._id.toString() !== task.user.toString()) {
            return res.status(400).send("You cannot delete");
        }

        await Task.findByIdAndDelete(req.params.id, (e) => {
            if (e) return res.status(500).send(e);
        });

        return res.send("Deleted");
    } catch (e) {
        return res.status(400).send(e);
    }
});

module.exports = router;
