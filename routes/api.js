/*
*
*
*       Complete the API routing below
*       
*       
*/


'use strict';
const { v4: uuidv4 } = require('uuid');

let projects = {}; // In-memory store for simplicity

module.exports = function (app) {
  // POST request to add a new issue
  app.route('/api/issues/:project')
    .post((req, res) => {
      const { project } = req.params;
      const { issue_title, issue_text, created_by, assigned_to = '', status_text = '' } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.status(400).json({ error: 'required field(s) missing' });
      }

      const newIssue = {
        _id: uuidv4(),
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      };

      if (!projects[project]) projects[project] = [];
      projects[project].push(newIssue);

      res.json(newIssue);
    })

    // GET request to fetch issues
    .get((req, res) => {
      const { project } = req.params;
      const filters = req.query;

      if (!projects[project]) return res.json([]);

      let filteredIssues = projects[project];

      // Apply filters
      for (let key in filters) {
        filteredIssues = filteredIssues.filter(issue => issue[key] == filters[key]);
      }

      res.json(filteredIssues);
    });

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  

  // PUT and DELETE endpoints will be implemented next...
};



