const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.post("/create", async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = new Task({
      title,
      description,
    });

    await task.save();

    res.status(201).json({
      message: "Task Added",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const task = await Task.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete('/:id', async(req, res) => {
  try{
    const task = await Task.findById(req.params.id)
    
    if(!task) {
      res.status(400).json({
        message : "Task Not found"
      })
    }

    await Task.findByIdAndDelete(req.params.id)
    res.json({
      message : "Post Deleted"
    })

  }catch(error){
    res.status(500).json({
      message : error.message
    })
  }
});

router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

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


router.put('/:id', async(req, res) => {
  try{
    const { title, description } = req.body;

    const task = await Task.findByIdAndUpdate(req.params.id, {
      title,
      description,
      status : req.body.status
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
