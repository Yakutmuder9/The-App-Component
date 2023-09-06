/*
============================================
; Title:  app.js
; Author: Professor Krasso
; Modified By: Yakut Ahmedin
; Date: 14 Aug 2023
; Description: employee routes
;===========================================
*/
"use strict"; // Enable strict mode to catch common coding mistakes

const express = require("express");
const { mongo } = require("../utils/mongo");
const router = express.Router();
const { ObjectId } = require("mongodb");
const Ajv = require("ajv");

const ajv = new Ajv(); // create new instance of ajv class

//  category schema
const categorySchema = {
  type: "object",
  properties: {
    categoryName: { type: "string" },
    backgroundColor: { type: "string" },
  },
  required: ["categoryName", "backgroundColor"],
  additionalProperties: false,
};

// define the schema to validate the new task
const taskSchema = {
  type: "object",
  properties: {
    text: { type: "string" },
    category: categorySchema,
  },
  required: ["text", "category"],
  additionalProperties: false,
};

// Define the schema for all the tasks
const tasksSchema = {
  type: "object",
  required: ["todo", "done"],
  additionalProperties: false,
  properties: {
    todo: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
          category: categorySchema,
        },
        required: ["_id", "text", "category"],
        additionalProperties: false,
      },
    },
    done: {
      type: "array",
      items: {
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
          category: categorySchema,
        },
        required: ["_id", "text", "category"],
        additionalProperties: false,
      },
    },
  },
};

/**
 * findEmployeeById
 * Description: Accept value 1007-1012
 * @example
 * localhost:3000/api/employees/1007 - 200: Success
 * localhost:3000/api/employees/asdf - 400: Bad Request
 * localhost:3000/api/employees/1016 - 404: Not Found
 * localhost:3000/api/employees/1008 - 500: Server Error (database not connected)
 */

/**
 * getTask
 */
router.get("/:empId", (req, res, next) => {
  try {
    let { empId } = req.params; // get the empId from the req.parms object
    empId = parseInt(empId, 10); // try determine if the empId is a numerical value

    if (isNaN(empId)) {
      const err = new Error("input must be number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId }); //find employee by ID

      if (!employee) {
        const err = new Error("Unable to find employee with empId " + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.send(employee); //return the task array
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * addTaskfer
 */
router.post("/:empId/tasks", (req, res, next) => {
  try {
    console.log("CreateTask API");

    let { empId } = req.params;
    empId = parseInt(empId, 10);

    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });

      console.log("employee", employee);

      if (!employee) {
        const err = new Error("Unable to find employee with empId" + empId);
        console.log("err", err);
        next(err);
        return;
      }

      const { task } = req.body;

      console.log("req.new task ", task);
      console.log("body ", req.body);

      // validate the req boject
      const validator = ajv.compile(taskSchema);
      const valid = validator(task);

      console.log("valid", valid);

      if (!valid) {
        const err = new Error("Bad request");
        err.status = 400;
        err.error = validator.errors;
        console.log("req.body validation faild", err);
        next(err);
        return;
      }

      // build the task object to insert into MongoDB atlas
      const newTask = {
        _id: new ObjectId(),
        text: task.text,
        category: task.category,
      };

      const result = await db
        .collection("employees")
        .updateOne({ empId }, { $push: { todo: newTask } });

      console.log("result", result);

      if (!result.modifiedCount) {
        const err = new Error("Unable to create tasks for empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.status(201).send({ id: newTask._id });
    }, next);
  } catch (error) {
    console.log("err", error);
    next(error);
  }
});

/**
 * updateTask
 */
router.put("/:empId/tasks", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });
      console.log("employee", employee);

      if (!employee) {
        const err = new Error("Unable to find employee with empId " + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      const tasks = req.body;
      console.log("tasks", tasks);

      const validator = ajv.compile(tasksSchema);
      const valid = validator(tasks);
      console.log("valid", valid);

      if (!valid) {
        const err = new Error("Bad Request");
        err.status = 400;
        err.errors = validator.errors;
        console.log("req.body validation failed", err);
        next(err);
        return;
      }

      const result = await db.collection("employees").updateOne(
        {
          empId,
        },
        { $set: { todo: tasks.todo, done: tasks.done } }
      );

      if (!result.modifiedCount) {
        const err = new Error("Unable to update tasks empId " + empId);
        err.status = 404;
        next(err);
        return;
      }

      res.status(204).send({ message: "Task updated successfully" });
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * deleteTasks
 */
router.delete("/:empId/tasks/:taskId", (req, res, next) => {
  console.log("inside the delete tasks function");

  try {
    let { empId } = req.params;
    const { taskId } = req.params;

    console.log(`EmpId: ${empId}; TaskId: ${taskId}`);

    empId = parseInt(empId, 10);

    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      let emp = await db.collection("employees").findOne({ empId });
      console.log("emp", emp);
      if (!emp) {
        const err = Error("Unable to find employee with empId " + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      if (!emp.todo) emp.todo = [];
      if (!emp.done) emp.done = [];

      const todoItems = emp.todo.filter(
        (task) => task._id.toString() !== taskId.toString()
      );
      const doneItems = emp.done.filter(
        (task) => task._id.toString() !== taskId.toString()
      );

      console.log(`Todo item: ${todoItems}: Done item: ${doneItems}`);

      const result = await db.collection("employees").updateOne(
        {
          empId: empId,
        },
        {
          $set: {
            todo: todoItems,
            done: doneItems,
          },
        }
      );

      console.log("result ", result);
      res.status(204).send({ message: "Task deleted successfully" });
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

module.exports = router;
