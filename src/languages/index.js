import {FirebaseAuth} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,  } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//import { firestore } from "firebase-admin";

const english= require("./en.json");
const hungarian= require("./hu.json");
const serbian= require("./rs.json");

function  get_text(indicator)
{   let text="";
    let code="en";
    let signed_in=!(getAuth().currentUser==null);

    code=localStorage.getItem("language");
    if(code==null)
    {
        localStorage.setItem("language",get_defaultlanguage());
        /*let user=getAuth().currentUser;
        let query_language= await getDoc(doc(firestore,"users",user.uid));
        query_language.then((a)=>{
            
        });*/
        
        
    }
    else if(code==null &&!signed_in)
    {
        code="sr-SR";
        localStorage.setItem("language",code);
    }

    //console.log(code);
    switch(code)
    {
        case "en":{text=contains_the_array(english,indicator);} break;
        case "hu-HU":{text=contains_the_array(hungarian,indicator);} break;
        case "sr-SR":{text=contains_the_array(serbian,indicator);} break;
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
        return english[word];
    else 
        return array[word];

}

function title_page(a,type="")
{
    return `${a} ${get_text(type)==undefined?"":get_text(type)} » ${get_text("app-title")}`;
}

const languages =[
    {
        code:"sr-SR",
        name:"Srpski"
    },
    
    {
        code:"hu-HU",
        name:"Magyar"
    },
    {
        code:"en",
        name:"English"
    }];


function get_defaultlanguage()
{
    return languages[0].code;
}
function replace_white(i="")
{
    return i.replaceAll(' ','_');
}
export
{
    get_text,
    get_title,
    languages,
    title_page,
    get_defaultlanguage,
    replace_white
}