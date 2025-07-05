// starting a backend project 
// npm init -y for importing package.json file npm is node package manager 
// what is packge manager and its use 
//A package manager is a tool that helps you install, update, and manage software libraries (packages) easily.



//! Real-life Example
// Imagine you're setting up a new phone:
//     App Store/Play Store = Package Manager
//     Apps = Packages (e.g., WhatsApp, Instagram)
// Instead of downloading apps from random websites, you use the App Store to install, update, or delete apps safely. The App Store also ensures the apps are compatible with your phone.
// In Programming:
//     npm (JavaScript)
//     pip (Python)
//     composer (PHP)
//     apt (Linux)

// made the folder + file 
//  public/temp

// .gitkeep file is used to keep the folder in the git repo even if it is empty 
// since the git does not keep the empty folder in the repo 

//.gitignore file is used to ignore the files that we do not want to push to the git repo 
// for example node_modules folder is not pushed to the git repo 
// so we add node_modules in the .gitignore file 

// env file is used to keep the secret keys and passwords 
// we do not want to push the secret keys and passwords to the git repo 

// src file is used to keep the source code of the project 
// made the src folder 

//^ nodemon
// nodemon is used to run the server when we make changes in the code nodemon automatically restarts the server so we do not have to restart the server again and again  
// npm install nodemon --save-dev 

//! mkdir is used to make the folder 
// mkdir foldername 
// example mkdir src database

//^ prettier code formatter 
// its used to format the code accourding the rules that we have set for a project 
// example code line format, code line length, code line spacing 
// npm install prettier --save-dev  --> for installing the prettier 
// create the file name  .prettierrc --> for setting the rules for the prettier 
// you can set the rules for the prettier in the .prettierrc file 
// ex 
// {
//     "singleQuote": true, --> single quote are allowed 
//     "semi": false,       --> semicolon are not allowed
//     "tabWidth": 4,       --> tab width is 4
//     "useTabs": true      --> use tabs are allowed
// } for more rules and usage visit the prettier documentation

//! .prettierignore 
// we can add those files her that we dont want it format its code 


//! imported 3 packges  {npm i express dotenv mongoose} -- command to install the packages  
// express for creating the server 
// dotenv for using the env file 
// mongoose for connecting the database 

// use of cors and cookie-parser 
// cors is used to connect the frontend and backend by allowing the request from the frontend
// cookie-parser is used to parse the cookie

//! user.model.js and usermodel.js both are same its just the naming convention


//! importing the class or function from other file 
// import { className {which declared in other file time of export} } 
// from './fileName.js {define the file path and the name given to the file}';

// both can be different 

// example 
class akash{
    akash() {
        console.log("akash");
    }
}

export { akash }; // exporting the class akash simple export 
// for importing it i have to use same name as given in the export 
//! if i want to use different name while importing then i have to use export default

import { akash as akash1 } from './notes.js'; // importing the class akash and renaming it to akash1

// the function or class and the file name can be diffrferent 