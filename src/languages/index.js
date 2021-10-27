import {FirebaseAuth} from "@/firebase";
import { getAuth } from "firebase/auth";

const english= require("./en.json");
const hungarian= require("./hu.json");
const serbian= require("./rs.json");

function get_text(indicator)
{   let text="";
    let code="en";
    const auth=getAuth();
    console.log(auth.languageCode);
    switch(code)
    {
        case "en":{text=contains_the_array(english,indicator);} break;
        case "hu-HU":{text=contains_the_array(hungarian,indicator);} break;
        case "rs":{text=contains_the_array(serbian,indicator);} break;
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
export
{
    get_text,
    get_title
}