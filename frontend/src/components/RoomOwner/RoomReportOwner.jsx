import { useEffect, useState, useRef } from 'react';
import useRoom from './RoomHook';
import { useParams} from 'react-router';
import {QRCodeCanvas} from 'qrcode.react';
import { Box, VStack, Button, Center, Container, Heading, HStack } from '@chakra-ui/react';

const CreateRoomReport = () => {
    const [roomName, setRoomName]=useState('')
    const [buildingName, setBuildingName]=useState('')
    
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
    
    return (
      <Container mt={5} p={4} rounded={8}>
          <HStack gap={4} justifyContent="center">       
          <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={8} p={4}>
            <Box>
              <Heading>Create QRCode for Room Feedback</Heading>
            </Box>
            <Box>
              <Center ref={qrCodeRef} my={4}>
                <VStack>
                  <QRCodeCanvas value={`http://51.12.218.158/room/feedback/${roomId}/`} size={128} />
                </VStack>
              </Center>
              <Box w="100%">{`http://51.12.218.158/room/feedback/${roomId}/`}</Box>
              <HStack my={4}>
                <Button onClick={downloadQRCode}>Download QRcode</Button>
                <Button onClick={printQRCode}>Print QRCode</Button>
              </HStack>
            </Box>
            
          </VStack>
        </HStack>

      </Container>
    );
};

export default CreateRoomReport;
