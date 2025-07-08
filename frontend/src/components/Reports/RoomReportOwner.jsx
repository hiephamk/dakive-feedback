import { useEffect, useState, useRef } from 'react';
import useRoom from '../RoomOwner/RoomHook';
import { useParams} from 'react-router';
import {QRCodeCanvas} from 'qrcode.react';
import { Box, VStack, Button, Center, Container, Heading, HStack, Switch } from '@chakra-ui/react';
// import { colorPalettes } from "compositions/lib/color-palettes"

const CreateRoomReport = () => {
    const [roomName, setRoomName]=useState('')
    const [buildingName, setBuildingName]=useState('')
    const [showSensorData, setShowSensorData] = useState(null)
    const [isChecked, setIsChecked] = useState(false)
    
    const {roomId, buildingId }= useParams();
    const {rooms} = useRoom(buildingId)

    const qrCodeRef = useRef(null)

    useEffect(() => {
      const roomFilter = rooms.find(room => room.id === Number(roomId));
      if (roomFilter) {
          setRoomName(roomFilter.name);
          setBuildingName(roomFilter.building_name);
      }
  }, [rooms, roomId]);

    const downloadQRCode = () => {
      const canvas = qrCodeRef.current.querySelector('canvas')
      if(canvas) {
        const image = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = image
        link.download = `qrcode of ${roomName} in ${buildingName}.png`
        link.click()
      }
    }
    
    const printQRCode = () => {
      const canvas = qrCodeRef.current?.querySelector('canvas');
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }
    
      const image = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('Failed to open print window');
        return;
      }
    
      const doc = printWindow.document;
      doc.open();
      doc.write('<html><head><title>DakiVe-Feedback</title></head><body></body></html>');
      doc.close();
    
      const style = doc.createElement('style');
      style.textContent = `
        body {
          text-align: center;
          font-family: Arial, sans-serif;
          margin: 40px;
        }
        .feedback-text {
          font-size: 24px;
          margin-top: 200px;
          margin-bottom: 100px;
        }
        .qr-img {
          width: 300px;
          height: 300px;
        }
      `;
      doc.head.appendChild(style);
    
      doc.body.innerHTML = `
        <div class="feedback-text">
          <h2>Anna meille palautetta sisäilmasta!</h2>
          <h2>Give us feedback about the air quality!</h2>
        </div>
        <img class="qr-img" src="${image}" alt="QR code for air quality feedback">
      `;
    
      const img = doc.querySelector('.qr-img');
      img.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
        setTimeout(() => printWindow.close(), 1000);
      };
    
      img.onerror = () => {
        console.error('Failed to load QR code image');
        printWindow.close();
      };
    };

    const generateRandom = (length = 10) => {
      let result = '';
      while (result.length < length) {
        result += Math.random().toString(36).substring(2);
      }
      return result.substring(0, length);
    };
    const [token1] = useState(generateRandom())
    const [token2] = useState(generateRandom())


    useEffect(() => {
      const token = isChecked
        ? 'x8Kbf6R4Ti'
        : 'mUDfq8mo33';
      setShowSensorData(token);
    }, [isChecked]);

    const link = `http://localhost:5173/room/feedback/${roomId}/${token1}${showSensorData}${token2}/`

   const handleCopy = async () => {
    // const link = `http://localhost:5173/room/feedback/${roomId}/${token1}${showSensorData}${token2}/`

  // Fallback function to copy text to clipboard
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Ensure the textarea is not visible
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        alert("Link copied!");
      } else {
        alert("Failed to copy link.");
      }
    } catch (err) {
      console.error("Fallback copy failed: ", err);
      alert("Failed to copy link.");
    }

    document.body.removeChild(textArea);
  };

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(link);
      alert("Link copied!");
    } else {
      // Use fallback method
      fallbackCopyTextToClipboard(link);
    }
  } catch (err) {
    console.error("Copy failed: ", err);
    fallbackCopyTextToClipboard(link);
  }
};
    return (
      <Box mt={5} p={4} rounded={8}>
          <HStack gap={4} justifyContent="center">       
          <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={8} p={4} w={"500px"}>
              <Heading my={"20px"}>QRCode for Room Feedback</Heading>
            <Box>
              <Switch.Root
                checked={isChecked}
                onCheckedChange={(e) => setIsChecked(e.checked)}
                colorPalette={"blue"}
              >
                <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Label fontWeight={"bold"}fontSize={"16px"}>Show Sensor Data</Switch.Label>
              </Switch.Root>
            </Box>
            <Box>
              <Center ref={qrCodeRef} my={4}>
                <VStack border={"1px solid"} p={"20px"}>
                  <QRCodeCanvas value={link} size={200} />
                </VStack>
              </Center>
              <HStack maxW={"480px"} justifyContent={"space-between"}>
                <Box border={"1px solid"} p={"10px"} rounded={"5px"} fontStyle={'italic'} maxW={"80%"}>{link}</Box>
                <Button onClick={handleCopy} height={"70px"}>copy link</Button>
              </HStack>
              <HStack my={4} justifyContent={"space-evenly"}>
                <Button onClick={downloadQRCode}>Download QRcode</Button>
                <Button onClick={printQRCode}>Print QRCode</Button>
              </HStack>
            </Box>
            
          </VStack>
        </HStack>

      </Box>
    );
};

export default CreateRoomReport;
