import {FirebaseAuth} from "@/firebase";
import { getAuth } from "firebase/auth";

const english= require("./en.json");
const hungarian= require("./hu.json");
const serbian= require("./rs.json");

function get_text(indicator)
{   let text="";
    let code="en";
    const auth=getAuth();
    code=localStorage.getItem("language");
    if(code==null)
    {
        code="sr-SR";
        localStorage.setItem("sr-SR",code);
        
    }
    console.log(code);
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

const languages=[
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
    },
];
function get_defaultlanguage()
{
    return languages[0].code;
}
export
{
    get_text,
    get_title,
    languages,
    get_defaultlanguage
}