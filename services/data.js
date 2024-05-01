

import * as FileSystem from 'expo-file-system';
import { PATH } from '../constants/global';



export const getFilesInDirectory = async (dir_path, setData, setLoading, setError) => {
  
    setLoading(true)
    setError(false)
    let files = [];
    let dir = await FileSystem.readDirectoryAsync(dir_path);

    dir.forEach((val, index) => {
      // read json file
      path = dir_path+val
      // console.log(path)
      // check if path is a directory
      FileSystem.getInfoAsync(path).then(
        (fileInfo) => {
          if(!fileInfo.isDirectory){
            FileSystem.readAsStringAsync(PATH.form_data+val).then(
              (xForm) =>{
                let tForm = JSON.parse(xForm)
                //console.log(val)
                let tmp = {
                  "id": index,
                  "file_name": val,
                  "form_name": tForm.meta.title,
                  "formID": tForm.meta.form_id,
                  "version":  tForm.meta.version,
                  "status":  tForm.meta.status,
                  "uuid":  tForm.meta.uuid,
                  "title":  tForm.meta.title,
                  "updated_on":  tForm.meta.updated_on,
                  "created_on":  tForm.meta.created_on,
                }
                files.push(tmp);
              }
            ).catch(
              (e) => {
                console.log(e)
                setError(true)
              }
              
            )  
          }
        }
      ).catch(
        (e) => {
          console.log(e)
        }
      )  
    });


    setData(files)
    setLoading(false)
    return files
}
