import { getStorage, ref, uploadBytes } from "firebase/storage";
import {storage,FireDb,FirebaseAuth,userId} from "@/firebase";

function fileUpload(path,file) {
    const userId = FirebaseAuth.currentUser.uid;
    const storageRef = ref(storage, `/${userId}/${path}`);
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });
}
function roomUpload(room_id,type,file) {
    fileUpload(`${room_id}/${type}`,file);
}