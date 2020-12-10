const express = require("express");
/**
 * Get all returns if empty, or selected return by _id
 * @route GET /returns
 * @group Returns - Returns
 * @param {string} returnId.query -  If empty returns all returns
 * @returns {Returns} 200 - Returns wheter selected return or all returns
 * @returns {ReturnsError} default - unexpected error
 */

/**
 * Create a new return when is request for user
 * @route POST /returns
 * @group Returns - Returns
 * @param {Returns} returns.body.required - New return
 * @returns {integer} 200 - Returns the  created return
 * @returns {ReturnError} default - unexpected error
 */

 /**
 * Update an existing return
 * @route PUT /returns
 * @group Returns - Returns
 * @param {string} returnId.query.required -  Return Id
 * @param {Return.model} return.body.required - New value for the return
 * @returns {Return} 200 - Returns the current state for this returns
 * @returns {ReturnError} default - unexpected error
 */

 /**
 * Delete an existing return
 * @route DELETE /returns
 * @group Returns - Returns
 * @param {string} returnId.query.required -  Return Id
 * @returns {Return} 200 - Returns the current state for this returns
 * @returns {ReturnError} default - unexpected error
 */

 
module.exports.register = (apiPrefix, router) => {
    
}