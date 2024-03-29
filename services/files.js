
import * as FileSystem from 'expo-file-system';

export const deleteFile = async (uri) => {
  try {
    // Delete the file
    await FileSystem.deleteAsync(uri);  
    console.log('File deleted successfully');
    return true
  } catch (error) {
    console.error('Error deleting file:', error);
    return false
  }
};

export const getFilesInDirectory = async (path) => {

    let files = [];
    let dir = await FileSystem.readDirectoryAsync(path);

    dir.forEach((val) => {

        FileSystem.readAsStringAsync(path+val).then(
          (xForm) =>{
            let tForm = JSON.parse(xForm)

            console.log(tForm.meta.version)
            let tmp = {
              "file_name": val,
              "form_name": tForm.meta.name,
              "version":  tForm.meta.version,
            }
            files.push(tmp);
          }
        ).catch(
          (e) => {
            throw new Error('Failed to fetch files')
          }
        );
    });

    return files

}


