const { MongoClient } = require("mongodb");
const nodemailer = require('nodemailer');

const uri = "mongodb://bug_sync:bug_sync_password@host.docker.internal:27017/";
const dbName = "test";
const bugsCollection = "bugs";
const usersCollection = "users";
const userDomains = new Map();
const bugPriorityDomains = new Map();

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to the MongoDB database.");

    const database = client.db(dbName);
    await processAllUser(database);
    await processOpenBugs(database);
    await processBugPriority(database);
    console.log(`Completed Bug assignment process`);
  } catch (error) {
    console.error("Error connecting to the database or fetching data:", error);
    await client.close();
  } finally {
    await client.close();
    console.log("Connection to MongoDB closed.");
  }
}

main().catch(console.error);

async function processAllUser(database) {
  const usersCollectionConnection = database.collection(usersCollection);

  const availableUsers = await usersCollectionConnection.find({is_delete:false, availability: 'available'}).toArray();
  availableUsers?.forEach(user => {

    const skills = user.skills;
    skills.forEach(skill => {
      const users = userDomains.get(skill);

      if (users) {
        userDomains.set(skill, [...users, user._id]);
      }
      else {
        userDomains.set(skill, [user._id]);
      }
    });
  })

  console.log(`*********** Printing processed user domains ***********`);
  userDomains.forEach((value, key) => {
    console.log(`domain: ${key}`, JSON.stringify(value));
  });


}

async function processOpenBugs(database) {
  const bugsCollectionConnection = database.collection(bugsCollection);
  const openBugs = await bugsCollectionConnection.find({status: 'open', is_delete: false, assignee_id: null}).toArray();

  openBugs.forEach(bug => {
    const bugs = bugPriorityDomains.get(bug.priority);
    if (bugs) {
      bugPriorityDomains.set(bug.priority, [...bugs, { _id: bug._id, domain: bug.domain }]);
    }
    else {
      bugPriorityDomains.set(bug.priority, [{ _id: bug._id, domain: bug.domain }]);
    }
  })

  console.log(`*********** Printing processed bug domains ***********`);
  bugPriorityDomains.forEach((value, key) => {
    console.log(`priority: ${key}`, JSON.stringify(value));
  });

}

async function processBugPriority(database) {
  const bugsCollectionConnection = database.collection(bugsCollection);
  const priorities = ['high', 'medium', 'low' ];

  for(const priority of priorities) {
    const bugs = bugPriorityDomains.get(priority);
    if(!bugs) continue;

    for(const bug of bugs) {
      console.log(`processing bug: ${bug._id} domain: ${bug.domain}`);
      const users = userDomains.get(bug.domain) ?? null;
      if(users) {
        const userId = users[0];
        console.log(`assigning userId for priority ${priority} and domain ${bug.domain}`, userId);
        await bugsCollectionConnection.updateOne({_id: bug._id}, {$set: {assignee_id: userId}});
        await sendEmailNotification(database, userId, bug._id);
        users.shift();
        users.push(userId);
        userDomains.set(bug.domain, users);
      }
    }

  }
}


const mailConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  user: 'abc@gmail.com',
  pass: 'abc password',
};

async function sendEmailNotification(database, userId, bugId) {
  console.log(`Sending email to userId: ${userId} for bugId: ${bugId}`);
  const usersCollectionConnection = database.collection(usersCollection);
  const bugsCollectionConnection = database.collection(bugsCollection);

  const userDetails = await usersCollectionConnection.findOne({_id: userId});
  const bugDetails = await bugsCollectionConnection.findOne({_id: bugId});

  const subject = `New ${bugDetails.priority} priority bug has been assigned to you from domain: ${bugDetails.domain}`
  const textContent = `Bug title: ${bugDetails.title} and description ${bugDetails.description}`;


  await sendEmail(userDetails.email, subject, textContent)

}


async function sendEmail(to, subject, text, html = '') {
  try {
    const transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.port === 465,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
      },
    });

    const mailOptions = {
      from: mailConfig.user,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}