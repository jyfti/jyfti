(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{61:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return s})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return b}));var a=n(2),r=n(6),i=(n(0),n(72)),o={id:"usage",title:"Usage"},s={unversionedId:"usage",id:"usage",isDocsHomePage:!1,title:"Usage",description:"Running a workflow",source:"@site/docs/usage.md",permalink:"/jyfti/docs/usage",editUrl:"https://github.com/jyfti/jyfti/edit/master/website/docs/usage.md",sidebar:"someSidebar",previous:{title:"Introduction",permalink:"/jyfti/docs/"},next:{title:"The Jyfti Format",permalink:"/jyfti/docs/format"}},c=[{value:"Running a workflow",id:"running-a-workflow",children:[]},{value:"Creating a workflow",id:"creating-a-workflow",children:[]},{value:"Step-by-step execution",id:"step-by-step-execution",children:[]}],p={rightToc:c};function b(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"running-a-workflow"},"Running a workflow"),Object(i.b)("p",null,"Run your first workflow."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"$ jyfti run https://raw.githubusercontent.com/jyfti/jyfti/master/workflows/retrieve-readme.json\n")),Object(i.b)("p",null,"Jyfti runs remote and local workflows.\nThe preferred way of developing workflows is within a local Jyfti project."),Object(i.b)("p",null,"Initialize a Jyfti project within your current directory."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"$ jyfti init\n")),Object(i.b)("p",null,"This results in a ",Object(i.b)("inlineCode",{parentName:"p"},"jyfti.json")," to be created where the configuration for your Jyfti project resides."),Object(i.b)("p",null,"Then, generate your first workflow."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"$ jyfti generate workflow retrieve-readme\n")),Object(i.b)("p",null,"The workflow is generated into the ",Object(i.b)("inlineCode",{parentName:"p"},"sourceRoot")," directory as ",Object(i.b)("inlineCode",{parentName:"p"},"retrieve-readme.json"),".\nIt serves you as a foundation to create your first productive workflow."),Object(i.b)("p",null,"Run the workflow to completion."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"$ jyfti run retrieve-readme\n? The GitHub organization (jyfti)\n? The GitHub repository (jyfti)\n")),Object(i.b)("p",null,"Jyfti prompts for inputs that the workflow expects.\nNote that inputs can also be passed directly."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"$ jyfti run retrieve-readme jyfti jyfti\n")),Object(i.b)("h2",{id:"creating-a-workflow"},"Creating a workflow"),Object(i.b)("p",null,"Let's inspect the generated ",Object(i.b)("inlineCode",{parentName:"p"},"retrieve-readme")," workflow."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json"}),'$ jyfti view retrieve-readme\n{\n  "$schema": "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json",\n  "name": "Retrieve README file of a GitHub repository",\n  "inputs": {\n    "org": {\n      "type": "string",\n      "description": "The GitHub organization",\n      "default": "jyfti"\n    },\n    "repo": {\n      "type": "string",\n      "description": "The GitHub repository",\n      "default": "jyfti"\n    }\n  },\n  "output": {\n    "$eval": "readmeResponse.body"\n  },\n  "steps": [\n    {\n      "assignTo": "readmeResponse",\n      "request": {\n        "method": "GET",\n        "url": "https://raw.githubusercontent.com/${org}/${repo}/master/README.md"\n      }\n    }\n  ]\n}\n')),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"$schema")," field allows editors like VSCode to validate your workflow against a schema and to autocomplete."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json"}),'{\n  "$schema": "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json"\n}\n')),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"inputs")," field defines a list of inputs to your workflow.\nEach input is assigned a ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://json-schema.org/"}),"json schema")," that Jyfti uses to validate and prompt for input.\nNote that inputs can be defined to be arbitrary json, but the CLI of Jyfti only reads flat inputs like strings and numbers."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json"}),'{\n  "inputs": {\n    "org": {\n      "type": "string",\n      "description": "The GitHub organization",\n      "default": "jyfti"\n    },\n    "repo": {\n      "type": "string",\n      "description": "The GitHub repository",\n      "default": "jyfti"\n    }\n  }\n}\n')),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"steps")," field defines a sequence of steps that are executed one after the other.\nEach step evaluates to a value that can be assigned to a variable with ",Object(i.b)("inlineCode",{parentName:"p"},"assignTo"),".\nA step can access the variables populated by all previous step.\nRead more about steps in the ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"#steps"}),"steps section"),"."),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"output")," field defines the ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://json-e.js.org/"}),"JSON-e expression")," that is returned after the workflow completed all steps."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json"}),'{\n  "output": {\n    "$eval": "readmeResponse.body"\n  }\n}\n')),Object(i.b)("h2",{id:"step-by-step-execution"},"Step-by-step execution"),Object(i.b)("p",null,"While ",Object(i.b)("inlineCode",{parentName:"p"},"jyfti run <name>")," executes a workflow from start to finish, Jifty can also execute a workflow step-by-step persisting intermediate states to disk."),Object(i.b)("p",null,"A step-by-step workflow run is created via the ",Object(i.b)("inlineCode",{parentName:"p"},"create")," subcommand."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"$ jyfti run create retrieve-readme jyfti jyfti\nCreated state.\n")),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"create")," subcommand validates the input and writes the initial state to disk.\nThe run can get advanced with the ",Object(i.b)("inlineCode",{parentName:"p"},"step")," subcommand."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"$ jyfti run step retrieve-readme\nCompleted 0\n")),Object(i.b)("p",null,"At any point, the status, the state and the variables can be requested."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),'$ jyfti run status retrieve-readme\n[Pending] At step [0]\n$ jyfti run state retrieve-readme\n{\n  "path": [\n    0\n  ],\n  "inputs": {\n    "org": "jyfti",\n    "repo": "jyfti"\n  },\n  "evaluations": []\n}\n$ jyfti run vars retrieve-readme\n{\n  "org": "jyfti",\n  "repo": "jyfti"\n}\n')),Object(i.b)("p",null,"A call to ",Object(i.b)("inlineCode",{parentName:"p"},"complete")," runs it to completion."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"$ jyfti run complete retrieve-readme\nCompleted 0\n")))}b.isMDXComponent=!0}}]);