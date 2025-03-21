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
      const canvas = qrCodeRef.current.querySelector('canvas')
      if(canvas) {
        const image = canvas.toDataURL('image/png')
        const printWindow = window.open('','_blank')
        const img = new Image()
        img.src = image
        img.style.maxWidth = '100%'

        printWindow.document.body.appendChild(img)

        img.onload = () => {
          printWindow.print()
          printWindow.onafterprint = () => printWindow.close()
        }
      }
    }

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
                  <QRCodeCanvas value={`http://localhost:5173/room/feedback/${roomId}`} size={128} />
                </VStack>
              </Center>
              <Box w="100%">{`http://localhost:5173/room/feedback/${roomId}`}</Box>
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
