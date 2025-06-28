
import { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaUpload } from "react-icons/fa";
import useAccessToken from "../../../services/token";
// import ProfileImg from "../ProfileImg";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


// eslint-disable-next-line react/prop-types
const CreateComment = ({ postId, setComments }) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileUpload = () => {
    fileInputRef.current.click(); // Programmatically open the file input
  };

  const handlePost = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    if (!accessToken) {
      console.error("Unable to fetch data: No valid access token.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("post", postId);
      formData.append("posts", postId);
      formData.append("author", userInfo.id);

      if (file) {
        formData.append("file", file); // Add file to FormData
      }

      const res = await axios.post("http://127.0.0.1:8000/api/comments/", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data", // Specify content type for file uploads
        },
      });

      setShow(false)
      setComments((prevComments) => [...prevComments, res.data]);

      // Clear the input fields
      setText("");
      setFile(null);
    } catch (error) {
      console.error(error, "Error posting comment");
    }
  };

  return (
    <div>
      <div>
        <div style={{display:'flex', justifyContent:'center'}}>
          <Button
            style={{width:'80%', padding:'5px', height:'50px', borderRadius:'30px' }}
            onClick={handleShow}>
            <input 
              type="text" 
              placeholder="Write a comment"
              style={{padding:'0 10px', width:'100%', height:'100%', borderRadius:'30px'}}
            />
          </Button>
        </div>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          className="text-dark"
        >
          <Modal.Header>
            <Modal.Title>Comment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="4"
                style={{ width: '100%' }}
                placeholder="Write your comments"
                className="text-dark"
              />
            </div>
          </Modal.Body>
          <Modal.Footer style={{display:'flex', justifyContent:'space-between'}}>
            <button style={{border: '1px solid #111', borderRadius:'10px', paddingRight:'10px', display:'flex', alignItems:'center'}} onClick={handleFileUpload}>
              <FaUpload
                style={{ fontSize: "1.5rem", cursor: "pointer", margin: "10px" }}
                title="Upload file"
              />
                <span><strong>Media</strong></span>
              <input
                type="file"
                accept="image/*,video/*"
                ref={fileInputRef} // Attach the ref to the input
                style={{ display: "none" }} // Hide the input field
                onChange={(e) => setFile(e.target.files[0])} // Handle file selection
              />
            </button>
            <div >
              <Button variant="primary" style={{marginRight:'10px'}} onClick={handlePost}>Post</Button>
              <Button variant="secondary" style={{marginLeft:'10px'}} onClick={handleClose}>Canncel</Button>
            </div>
          </Modal.Footer>
            <div className="px-4">
              {file && (
                <div>
                  <strong>Selected file:</strong> {file.name}
                </div>
              )}
            </div>
        </Modal>
      </div>
      <div>
        {/* {file && (
          <div>
            <strong>Selected file:</strong> {file.name}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default CreateComment;
