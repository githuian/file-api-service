# File Upload & Download API

A simple REST API to upload and download files using Node.js and Express.

## Endpoints

### POST /upload

Upload a file using multipart/form-data  
**Form field**: `file`

Response:
```json
{
  "filename": "generated_file_id",
  "originalName": "yourfile.txt"
}
