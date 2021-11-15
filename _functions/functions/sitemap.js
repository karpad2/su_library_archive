import * as functions from "firebase-functions";
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const PDFImage= require("pdf-image").PDFImage;
const fromPath =require("pdf2pic");
const mkdirp = require('mkdirp');
const { mkdirsSync } = require("fs-extra");
const { Storage } = require('@google-cloud/storage');
const rimraf = require('rimraf');

const path = require('path');
const os = require('os');
const fs = require('fs');


  
  