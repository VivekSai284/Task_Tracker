const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      user : req.user.id
    });

    await task.save();

    res.status(201).json({
      message: "Task Added",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const task = await Task.find({user:req.user.id})
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete('/:id', authMiddleware, async(req, res) => {
  try{
    const task = await Task.findOneAndDelete({_id : req.params.id, user : req.user.id})
    
    if(!task) {
      res.status(400).json({
        message : "Task Not found"
      })
    }

    res.json({
      message : "Task Deleted"
    })

  }catch(error){
    res.status(500).json({
      message : error.message
    })
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


router.put('/:id', authMiddleware, async(req, res) => {
  try{
    const { title, description, dueDate, status } = req.body;

    const task = await Task.findByIdAndUpdate({_id : req.params.id, user : req.user.id}, {
      title,
      description,
      dueDate,
      status
    },{
      new : true,
      runValidators : true
    });

    if(!task){
      return res.status(404).json({
        message : "Task not Found"
      })
    }

    res.json({
      message : "Task Updated",
      task,
    });


  }catch(error){
    res.status(500).json({
      message : error.message
    })
  }
})

module.exports = router;
