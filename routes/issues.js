var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const fs = require('fs')
const dataPath ='./data/db.json'

//util functions
const saveIssueData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync(dataPath, stringifyData)
}

const getIssueData = () => {
  const jsonData = fs.readFileSync(dataPath)
  return JSON.parse(jsonData)    
}

// GET issues
router.get('/',(req,res)=>{
  console.log('READ Operation')
  fs.readFile(dataPath, 'utf8', (err,data)=>{
      if(err){
          throw err;
      }
      res.render('index',{issues:JSON.parse(data)})
  })
})

router.get('/add-issue',(req,res)=>{
  res.render('add_issue')
})

// ADD issues
router.post('/issue/addissue',(req,res)=>{
  console.log("CREATE Operation");
  var existIssues = getIssueData()
  const newIssueId = Math.floor(100000 + Math.random() * 900000)
  existIssues[newIssueId] = req.body 
  saveIssueData(existIssues);
  console.log('Issue added successfully')
  res.redirect('/')
})

// UPDATE issue
router.post('/update-issue/:id',(req,res)=>{
  console.log('UPDATE operation')
  var existIssues = getIssueData()
  fs.readFile(dataPath,'utf-8',(err,data)=>{
      const issueId = req.params['id'];
      existIssues[issueId] = req.body;
      saveIssueData(existIssues);
      console.log(`issue with id ${issueId} has been updated`);
      res.redirect('/')
  },true)
});

router.get('/update-issue',(req,res)=>{
  const curr_id = req.query.id;
  res.render('update_issue',{issue:getIssueData(),issueId:curr_id})
})

// DELETE issue
router.get('/delete-issue/', (req, res) => {
  console.log('DELETE operation')
  fs.readFile(dataPath, 'utf8', (err, data) => {
      var existIssues = getIssueData()
      const userId = req.query.id;
      delete existIssues[userId];  
      saveIssueData(existIssues);
      console.log(`issue with id ${userId} has been deleted`);
      res.redirect('/')
 }, true);
})

module.exports = router;