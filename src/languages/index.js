import {FirebaseAuth,logerror} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,  } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {convertWordToCyrillic} from "./transliteration"
//import { firestore } from "firebase-admin";

const english= require("./en.json");
const hungarian= require("./hu.json");
const serbian= require("./rs.json");
const croatian= require("./cro.json");

function  get_text(indicator)
{   let text="";
    let code="en-EN";
    let signed_in=!(getAuth().currentUser==null);

    code=localStorage.getItem("language");
    if(code==null)
    {
        localStorage.setItem("language",get_defaultlanguage());
        
    }
    else if(code==null &&!signed_in)
    {
        code="rs-RS";
        localStorage.setItem("language",code);
    }

    //console.log(code);
    switch(code)
    {
        case "en-EN":{text=contains_the_array(english,indicator);} break;
        case "hu-HU":{text=contains_the_array(hungarian,indicator);} break;
        case "rs-RS":{text=contains_the_array(serbian,indicator);} break;
        case "sr-SR":{text=convertWordToCyrillic(contains_the_array(serbian,indicator));} break;
        case "hr-HR":{text=contains_the_array(croatian,indicator);} break;
    }
    return text
}
function get_title()
{
    return get_text("title");
}
function contains_the_array(array,word)
{

    if(array[word]==undefined)
      { console.log(word);
        logerror(`lang:${localStorage.getItem("language")} err word missing,word:${word}`);
        return word;   
        //return english[word];
      }
    else 
        return array[word];

}

function title_page(a,type="")
{   let b=a;
    if(a=="undefined"||a==undefined) b="";
    return `${b} ${get_text(type)==undefined?"":get_text(type).slice(0,1).toUpperCase()+get_text(type).slice(1,get_text(type).length)} » ${get_text("app-title")}`;
}

const languages =[
    {
        code:"rs-RS",
        name:"Srpski"
    },
    
    {
        code:"hu-HU",
        name:"Magyar"
    },
    {
        code:"hr-HR",
        name:"Hrvatski"
    },
    {
        code:"en-EN",
        name:"English"
    }];


function get_defaultlanguage()
{
    return languages[0].code;
}
function replace_white(i="")
{
    let k=i.replaceAll(' ','_');
    k=k.replaceAll('#','[sharp]');
    k=k.replaceAll('/','[slash]');
    return k;
}
function replace_under(i="")
{
    return i.replaceAll('_',' ');
}
function get_text_by_language(a,b)
{
    let l="";
    let code="en-EN";
    let signed_in=!(getAuth().currentUser==null);

    code=localStorage.getItem("language");
    if(code==null)
    {
        localStorage.setItem("language",get_defaultlanguage());
        
    }

    switch(code)
    {
        case "en-EN":{l=`${get_text(a)} ${get_text(b)}`;} break;
        case "hu-HU":{l=`${get_text(b)} ${get_text(a)}`;} break;
        case "rs-RS":{l=`${get_text(a)} ${get_text(b)}`;} break;
        case "sr-SR":{l=`${get_text(a)} ${get_text(b)}`;} break;
        case "hr-HR":{l=`${get_text(a)} ${get_text(b)}`;} break;
    }
    return l;

}
export
{
    get_text,
    get_title,
    languages,
    title_page,
    get_defaultlanguage,
    replace_white,
    replace_under,
    get_text_by_language
}