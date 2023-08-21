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
      res.send(employee);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

module.exports = router;
