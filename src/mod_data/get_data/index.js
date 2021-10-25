
import {FireDb,FirebaseAuth,firestore,userId} from "@/firebase";
import { collection, doc, setDoc, query, where, getDocs,getDoc  } from "firebase/firestore";
import {ref, set ,onValue,get, child,push,runTransaction } from "firebase/database";
import router from "@/router";

const booksRef = collection(firestore, "books");
console.log(booksRef);

function get_data_fromdb(k){
    const ref=doc(firestore,"books",k);
    const snap=getDoc(ref);

    let b=[];
    
  //return b;
  }
  function search_for_books(k)
  {
    const ref=doc(firestore,"books",k);
    const query=query(collection(firestore,"books"),where("author","array-contains-any",k),where("title","array-contains-any",k),("keywords","array-contains-any",k))
    const snaps=getDocs(query);
    return snaps;
  }
  function get_book(k)
  {
    const ref=doc(firestore,"books",k);
    const snap=getDoc(ref);
    if(snap.exists())
    {
      snap.data();
    }

    snap.id
  }
  function get_data_fromroomdb(room_id,k){
    const userId = FirebaseAuth.currentUser.uid;
    let b=[];
    
    
     onValue(ref(FireDb, `/users/${userId}/rooms/${room_id}/${k}`),(sn)=>
     {
       if(sn.exists())
       console.log(sn);
      sn.forEach((l)=>
     {
       b.push({
         data:l.val(),
         dev_id:l.key
       });
     })});
    
    return b;
  }

  function  get_data_fromroomitemdb(room_id,k){
    const userId = FirebaseAuth.currentUser.uid;
    let b=null;
     onValue(ref(FireDb, `/users/${userId}/rooms/${room_id}/${k}`),(sn)=>
     {
       if(sn.exists())
       {
       
       b=sn.val();
       console.log(b);
      }   
    });
    return b;
  }

  function get_data_from_allroomdb(k){
    let room_id="",room_name="";
   const userId = FirebaseAuth.currentUser.uid;
    let b=[];
onValue(ref(FireDb, `/users/${userId}/rooms`),(sn_out)=>{
      if(sn_out.exists()){
        sn_out.forEach((l)=>{
        room_id=l.key;
        room_name=l.val().room_name;
        //console.log(room_id);
       // console.log(`/users/${userId}/rooms/${room_id}/${k}`);
       onValue(ref(FireDb, `/users/${userId}/rooms/${room_id}/${k}`),(sna)=>{
           if(sna.exists())
              {
              //console.log(sna);
              sna.forEach((lb)=>{
                b.push(
                  {data:lb.val(),
                  room_id:room_id,
                  room_name:room_name,
                  dev_id:lb.key});     
              });
              }
            });
        });

      }
    });

    return b;
}

function  get_rooms(){
    let l=[];
    const userId = FirebaseAuth.currentUser.uid;
    onValue(ref(FireDb, `/users/${userId}/rooms`),(sn)=>
    {
      if(sn.exists())
      {
        sn.forEach((element) => {
            l.push(
            {
              data:element.val(),
              devID:element.key
            });
        });
      }
     
    });
     return l;
  
 }
 function get_encoding(r_id,p_id=null)
 {
  const userId = FirebaseAuth.currentUser.uid;
  let reference=ref(FireDb, `/users/${userId}/rooms/${r_id}/programs/${p_id}/program_encoding`);
  let k="";
  if(p_id==null) 
  {
    reference=ref(FireDb, `/users/${userId}/rooms/${r_id}/active_program`);
    onValue (reference,(sn)=>{
      if(sn.exists())
      {
        k=sn.val();
      }});
  }
  else
  {
    k=p_id;
  }
  let encoding="";
  const defaultvalue="base64";
 /* reference=ref(FireDb, `/users/${userId}/rooms/${r_id}/programs/${k}/program_encoding`);
  onValue (reference,(sn)=>{
    if(sn.exists())
    {
      encoding=sn.val();
    }
    else {
    set(reference,defaultvalue);
    encoding=defaultvalue;        
      }
  });*/
  encoding=defaultvalue;
  return encoding;
 }

export {
    get_data_fromdb,
    get_data_from_allroomdb,
    get_data_fromroomdb,
    get_rooms ,
    get_encoding,
    get_data_fromroomitemdb
}
