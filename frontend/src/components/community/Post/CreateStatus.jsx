
import { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import ProfileImg from "../ProfileImg";
import { FaUpload } from "react-icons/fa";
import useCircle from "../Circles/useCircle";
import useAccessToken from "../../../services/token";
import { Box, Button, Input, Textarea } from "@chakra-ui/react";


const CreateStatus = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const circle = useCircle();
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [visibility, setVisibility] = useState("public"); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const url = `http://127.0.0.1:8000/api/posts/`;
      const formData = new FormData();
  
      // Ensure content is a string (if it's an array, join the elements as a string)
      const quillContent = Array.isArray(content) ? content.join(" ") : content || '';  // Convert array to string if necessary
  
      // Ensure content is not empty
      if (!quillContent.trim()) {
          alert("The content must not be empty.");
          return;
      }
  
      // Append content to formData
      formData.append("content", quillContent);
      formData.append("author", userInfo.id);
  
      // Handle circle selection if visibility is set to "circles"
      if (visibility === "circles") {
          const circleId = circle?.Circle?.[0]?.id;
          if (circleId) {
              formData.append("circle", circleId);
          } else {
              alert("No circle found!");
              return;
          }
      }
  
      // Append file if exists
      if (file) {
          formData.append("file", file);
      }
  
      // Append visibility option
      formData.append("visibility", visibility);
  
      // Make the API request
      try {
          const response = await axios.post(url, formData, {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "multipart/form-data",
              },
          });
  
        //   onPostCreated(response.data);
          setContent("");  // Reset content
          setFile(null);  // Reset file input
          setVisibility("public");  // Reset visibility
          setIsModalOpen(false);  // Close the modal
  
      } catch (error) {
          console.error("Error creating post:", error.response?.data || error.message);
          alert("Failed to create post.");
      }
  };
  const handleFileUpload = () => {
    fileInputRef.current.click(); // Programmatically open the file input
  };
  return (
    <Box>
      <Box className="d-flex">
        {/* <ProfileImg /> */}
          <Button
            className="btn btn-primary"
            type="button"
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '5px', width: '80%', borderRadius: '30px', margin: 'auto' }}
        >
            <Input
                type="text"
                placeholder="Tell us your stories"
                style={{ padding: '10px 20px', width: '100%', borderRadius: '20px' }}
            />
        </Button>
    </Box>
    {isModalOpen && (
        <Box className="modal show text-black" tabIndex="-1" style={{ display: "block" }} aria-labelledby="staticBackdropLabel">
            <Box className="modal-dialog">
                <Box className="modal-content">
                    <Box className="modal-header">
                        <Box className="d-flex">
                            {/* <ProfileImg /> */}
                            <Box className="px-3">
                                <h5 className="modal-title text-black" id="staticBackdropLabel">
                                    Create Post
                                </h5>
                                <Box className="d-flex flex-column">
                                    <select
                                        id="visibility"
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value)}
                                    >
                                        <option value="public">Public</option>
                                        <option value="onlyme">Only Me</option>
                                        <option value="circles">Circles</option>
                                        <option value="circles">Groups</option>
                                    </select>
                                </Box>
                            </Box>
                        </Box>
                        <Button
                            type="Button"
                            className="btn-close"
                            onClick={() => setIsModalOpen(false)}
                            aria-label="Close"
                        ></Button>
                    </Box>
                    <Box className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <Textarea
                                id="content"
                                placeholder="Tell us your story!"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                style={{
                                    border: "1px solid #111",
                                    width: "100%",
                                    borderRadius: "5px",
                                    padding: "10px",
                                }}
                            />
                           <Box className="d-flex justify-content-lg-between mx-3">
                              <Button onClick={handleFileUpload} className="me-3">
                                <FaUpload
                                  className="border rounded-5 border-black"
                                  title="Upload file"
                                  style={{width:'30px', height:'30px'}}
                                />
                                <Input
                                    type="file"
                                    id="file"
                                    ref={fileInputRef}
                                    onChange={(e) => setFile(e.target.files[0])}
                                    accept="image/*,video/*"
                                    style={{
                                        display:'none'
                                    }}
                                />
                              </Button>
                              <Button className="btn btn-primary">
                                  Post
                              </Button>
                           </Box>
                           <Box className="px-4">
                            {file && (
                              <Box>
                                <strong>Selected file:</strong> {file.name}
                              </Box>
                            )}
                          </Box>
                        </form>
                    </Box>
                </Box>
            </Box>
        </Box>
    )}
    </Box>
  );
};

export default CreateStatus;
