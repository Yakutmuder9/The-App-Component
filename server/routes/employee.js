/*
============================================
; Title:  app.js
; Author: Professor Krasso
; Modified By: Yakut Ahmedin
; Date: 14 Aug 2023
; Description: employee routes
;===========================================
*/
"use strict";

const express = require("express");
const { mongo } = require("../utils/mongo");
const router = express.Router();
const { ObjectId } = require('mongodb');
const Ajv = require("ajv");

const ajv = new Ajv(); // create new instance of ajv class

//  define the schema to validate t he new task
const taskSchema = {
  type: "object",
  properties: {
    text: { type: "string" },
  },
  required: ["text"],
  additionalProperties: false,
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

      const { text } = req.body;

      console.log("req.body", req.body);

      // validate the req boject
      const validator = ajv.compile(taskSchema);
      const valid = validator({ text });

      console.log("valid", valid);

      if (!valid) {
        const err = new Error("Bad request");
        err.status = 400;
        err.error = validator.errors;
        console.log("req.body validation faild", err);
        next(err);
        return;
      }

      const task = {
        _id: new ObjectId(),
        text,
      };

      const result = await db
        .collection("employees")
        .updateOne({ empId }, { $push: { todo: task } });

      console.log("result", result);

      if (!result.modifiedCount) {
        const err = new Error("Unable to create tasks for empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.status(201).send({ id: task._id });
    }, next);
  } catch (error) {
    console.log("err", error);
    next(error);
  }
});
module.exports = router;
