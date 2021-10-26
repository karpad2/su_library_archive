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
        case "en":{text=english[indicator];} break;
        case "hu":{text=hungarian[indicator];} break;
        case "rs":{text=serbian[indicator];} break;
    }
    return text
}
function get_title()
{
    return get_text("title");
}
export
{
    get_text,
    get_title
}