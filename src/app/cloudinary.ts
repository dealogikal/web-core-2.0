import { FileUploaderOptions } from "ng2-file-upload";

const config: any = {
    cloud_name: 'dealogikal',
    upload_preset: 'mwzkpiee',
    api_key: '526263877935813',
    api_secret: 'NKFdj1-CcmS2E325tZ5XDJPangc',
}

const cloudinaryURLUpload = `https://api.cloudinary.com/v1_1/${config.cloud_name}/raw/upload`;
const cloudinaryURLDestroy = `https://api.cloudinary.com/v1_1/${config.cloud_name}/image/destroy`;
const cloudinaryURLUploadRaw = `https://api.cloudinary.com/v1_1/${config.cloud_name}/raw/upload`;
const cloudinaryURLDestroyRaw = `https://api.cloudinary.com/v1_1/${config.cloud_name}/raw/destroy`;

const uploader_options: FileUploaderOptions = {
    url: cloudinaryURLUpload,
    // Upload files automatically upon addition to upload queue
    autoUpload: true,
    // Use xhrTransport in favor of iframeTransport
    isHTML5: true,
    // Calculate progress independently for each uploaded file
    removeAfterUpload: true,
    // XHR request headers
    headers: [
        {
            name: 'X-Requested-With',
            value: 'XMLHttpRequest'
        }
    ]
};

export {
    uploader_options,
    config
}