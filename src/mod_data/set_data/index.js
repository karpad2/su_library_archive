import {FireDb,FirebaseAuth,firestore,userId} from "@/firebase";
import { collection, doc, setDoc, query, where, getDocs,getDoc  } from "firebase/firestore";
import {deletep} from "@/mod_data/del_data";
import router from "@/router";
import { getStorage, ref,uploadBytes } from "firebase/storage";
import PDFJS from "pdfjs";

function add_user(k)
    {
      getAuth()
      .createUser({
        email: k.useremail,
        emailVerified: false,
        phoneNumber: k.phone,
        password: k.phone,
        displayName: k.name,
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false,
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
      })
      .catch((error) => {
        console.log('Error creating new user:', error);
      });
    }
    function add_book(k,pdf)
    {
      PDFJS.disableWorker = true;
      const booksRef = collection(firestore, "books");
      
      console.log(FirebaseAuth.currentUser.uid);

      setDoc(doc(citiesRef),{
        "author":k.author,
        "title":k.title,
        "publisher":k.publisher,
        "keywords":k.keywords,
        photoURL:k.storagelink
      });

      const metadata = {
        contentType: 'image/jpeg',
      };
      const storageRef = ref(storage, 'images/mountains.jpg');
      const uploadTask = uploadBytes(storageRef, file, metadata);
      
    }    
    function add_camera (room_id,l,k=null){
     
      if(l=="") return;
      console.log("Add Camera");
     
      const userId = FirebaseAuth.currentUser.uid;
        
    let postData =  {
          "camera_name":l,
          "camera_url":""
          };
          if(k!=null) postData=k;   
        try{
      let frooms= ref(FireDb, `/users/${userId}/rooms/${room_id}/cameras/`);
      let newroomref = push(frooms);
      set(newroomref,postData);
      }
      catch (E)
      {
        console.error(E);
      }

    }
    function add_device(room_id,l,k=null)
    {
     
      if(l=="") return;
      console.log("Add Device");
      //const room_id=this.$route.params.rid;
      const userId = FirebaseAuth.currentUser.uid;
        
    let postData =  {
                                "device_name":l,
                                "mode":"relay",
                                "status":"0"
                      };
    if(k!=null) postData=k;
   try
      {
      let frooms= ref(FireDb, `/users/${userId}/rooms/${room_id}/devices/`);
      let newroomref = push(frooms);
      set(newroomref,postData);
      }
      catch (E)
      {
        console.error(E);
      }
    }

   function add_room(room_name,k=null)
    {
      console.log("Add Room");
      console.log(room_name);
      if(room_name==="") return;
      console.log("Add Room");
        
    let postData = {
                        "room_name":room_name,
                        "programs":{
                           "test": {
                                "program_name":"test",
                                "active_program":true,
                                "program_xml":"",
                                "program_javascript":"",
                                "program_active":true}
                        }
                        ,
                        "devices":[]};
    if(k!=null) postData=k;
    postData.room_name=room_name;
       try
      {
      let frooms= ref(FireDb, `users/${FirebaseAuth._currentUser.uid}/rooms`);
      let newroomref = push(frooms);
      set(newroomref,postData);
      }
      catch (E)
      {
        console.error(E);
      }
      //this.showDialog=false;
      
       
    }
function start_run(room_id,team_name="Test Name",solving_time=60)
{     
      const userId = FirebaseAuth.currentUser.uid;
      let active_program=null;

      //if(status_run!=null) return;
      if(status_run!=null)
      {
        console.log("Status run detected lol");
      }
      
      onValue(ref(FireDb, `/users/${userId}/rooms/${room_id}/active_program`),(sn)=>
      {
        if(sn.exists()) active_program=sn.val();
      });
      let frooms= ref(FireDb, `/users/${userId}/rooms/${room_id}/current_run`);

      let d=new Date();
      let finishing_time= d.getTime()+solving_time * 60*1000;          
             
      //let newroomref = push(frooms);
      let postData={
        team_name:team_name,

        starting_time:new Date().getTime(),
        program_id:active_program,
        active:true,
        finishing_time:finishing_time
      };
      set(frooms,postData);
    
}
function stop_run(room_id)
{     
      
      let postData=null;
      let frooms= ref(FireDb, `/users/${FirebaseAuth.currentUser.uid}/rooms/${room_id}/past_runs/`);
      let newroomref = push(frooms);
      
      let d=new Date();

      postData=status_run(room_id);
      postData.finishing_time=d.getTime();
      postData.active=false;
      set(newroomref,postData);
      deletep(`rooms/${room_id}/current_run`);
      
}
function status_run(room_id)
{     
      
      let postData=null;
      onValue(ref(FireDb, `/users/${FirebaseAuth.currentUser.uid}/rooms/${room_id}/current_run`),(sn)=>
      {
        if(sn.exists()) 
        {
          postData=sn.val();
          console.log(postData);
        }

      });
      return postData;
  }        
   

export
{
    add_camera,
    add_device,
    start_run,
    status_run,
    stop_run,
    add_room,
    add_event,
    add_user

}